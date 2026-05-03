import { useState, useRef, useEffect } from 'react';
import useChat from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import { Send, Loader2 } from 'lucide-react';
import './ChatInterface.css';

const QUICK_QUESTIONS = [
  "What are the steps to register to vote?",
  "When is the next election in my area?",
  "How does vote counting work?",
  "What ID do I need to vote?",
  "How are election results certified?"
];

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>ElectIQ</h1>
        <p>Interactive Election Process Assistant</p>
      </div>

      <div className="messages-area" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="welcome-area">
            <h3>How can I help you today?</h3>
            <div className="quick-chips">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button 
                  key={idx} 
                  className="quick-chip"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about election processes, requirements, or timelines..."
            rows={1}
          />
          <button 
            className={`send-button ${!input.trim() || isLoading ? 'disabled' : ''}`}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
        <p className="disclaimer">ElectIQ provides general information. Always verify with official sources.</p>
      </div>
    </div>
  );
};

export default ChatInterface;
