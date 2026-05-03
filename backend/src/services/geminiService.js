import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSession, saveSession } from './firestoreService.js';
import { toolDefinitions, toolRegistry } from '../tools/index.js';
import logger from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Diagnostic check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('[GEMINI ERROR] GEMINI_API_KEY is not defined in environment variables!');
} else {
  console.log('[GEMINI DEBUG] GEMINI_API_KEY is present.');
}

const SYSTEM_INSTRUCTION = `You are ElectIQ, a friendly and authoritative civic education assistant specialising in election processes. Your role is to:
1. Explain election steps, timelines, and voter requirements in plain, accessible language
2. Tailor explanations to the user's country/region when provided
3. Use the available tools to fetch real-time voter info, officials, and news
4. Always cite your sources when using search results
5. Break complex processes into numbered steps
6. Never express political bias or preference toward any party or candidate
7. When uncertain, clearly say so and suggest official government sources
8. Respect user privacy — never store or repeat personally identifiable information`;

/**
 * Handles the main AI conversation with session memory and tool use.
 * @param {string} sessionId - The unique identifier for the session.
 * @param {string} userMessage - The message from the user.
 * @returns {Promise<Object>} - The AI response including text and metadata.
 */
export const chat = async (sessionId, userMessage) => {
  try {
    console.log(`[GEMINI DEBUG] Starting chat for session: ${sessionId}`);
    const session = await getSession(sessionId) || { history: [] };
    console.log(`[GEMINI DEBUG] Session history length: ${session.history?.length || 0}`);
    
    const history = session.history || [];

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: toolDefinitions }],
    });

    const chatSession = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    console.log('[GEMINI DEBUG] Sending message to model...');
    let result = await chatSession.sendMessage(userMessage);
    console.log('[GEMINI DEBUG] Received response from model.');
    
    let response = result.response;
    let calls = response.functionCalls();

    const toolsUsed = [];

    // Handle function calls in a loop (agentic tool use)
    while (calls && calls.length > 0) {
      const toolResponses = [];

      for (const call of calls) {
        const { name, args } = call;
        logger.debug(`Calling tool: ${name} with args:`, args);
        toolsUsed.push(name);

        const toolFn = toolRegistry[name];
        if (toolFn) {
          try {
            const toolResult = await toolFn(args);
            toolResponses.push({
              functionResponse: {
                name,
                response: { content: toolResult }
              }
            });
          } catch (error) {
            logger.error(`Error in tool ${name}:`, error);
            toolResponses.push({
              functionResponse: {
                name,
                response: { error: error.message }
              }
            });
          }
        }
      }

      // Send tool results back to the model
      result = await chatSession.sendMessage(toolResponses);
      response = result.response;
      calls = response.functionCalls();
    }

    const responseText = response.text();
    
    // Update history
    const updatedHistory = await chatSession.getHistory();
    await saveSession(sessionId, { history: updatedHistory });

    return {
      text: responseText,
      toolsUsed,
      sources: [] // Simplified for now, could be extracted from search results
    };
  } catch (error) {
    console.error('[GEMINI ERROR] Full error object:', error);
    console.error('[GEMINI ERROR] Message:', error.message);
    
    logger.error('Gemini chat error:', error);

    // Fallback: Provide a helpful mock response if Gemini fails due to quota or in development/demo mode
    if (process.env.NODE_ENV === 'development' || isQuotaError(error) || process.env.ENABLE_DEMO_MODE === 'true') {
      logger.info('Using fallback response due to Gemini error or demo mode.');
      const fallbackResponse = getDevelopmentFallback(userMessage);
      return {
        text: fallbackResponse,
        toolsUsed: ['mock_fallback'],
        sources: [{ title: 'ElectIQ Demo Mock', url: '#' }]
      };
    }

    throw new Error('I am sorry, but I encountered an error while processing your request. Please try again later.');
  }
};

/**
 * Checks if an error is a Gemini quota/rate limit error.
 */
function isQuotaError(error) {
  return error?.status === 429 || 
         error?.message?.includes('quota') || 
         error?.message?.includes('rate limit') ||
         error?.message?.includes('429');
}

/**
 * Provides static mock responses for development testing when API is unavailable.
 */
function getDevelopmentFallback(message) {
  const msg = message.toLowerCase();
  if (msg.includes('register') || msg.includes('how to vote')) {
    return "In demo/development mode: To register to vote, you typically need to visit your local election office website. In the US, Vote.gov is the primary resource. Since the live AI is currently unavailable (likely due to API quota limits), I'm providing this static helpful tip!";
  }
  if (msg.includes('hello') || msg.includes('hi')) {
    return "Hello! I'm ElectIQ (Demo Mode). I'm currently running with mock responses because the Gemini API quota has been reached. How can I help you test the interface today?";
  }
  return "I'm currently in Demo Fallback mode. My AI brain (Gemini) is resting due to quota limits, but I can still help you test the UI! Ask me about 'registration' or say 'hello'.";
}
