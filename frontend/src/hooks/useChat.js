import axios from 'axios';
import useChatStore from '../store/chatStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const CLIENT_API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

const useChat = () => {
  const { sessionId, messages, addMessage, setLoading, setError, isLoading } = useChatStore();

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Optimistic update
    addMessage({ role: 'user', text });
    setLoading(true);
    setError(null);

    try {
      console.log(`[FRONTEND DEBUG] Sending chat to: ${API_BASE_URL}/chat`);
      console.log(`[FRONTEND DEBUG] Using API Key: ${CLIENT_API_KEY ? '***' + CLIENT_API_KEY.slice(-4) : 'MISSING'}`);
      
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        sessionId,
        message: text
      }, {
        headers: {
          'x-api-key': CLIENT_API_KEY
        }
      });

      addMessage({ 
        role: 'model', 
        text: response.data.text,
        toolsUsed: response.data.toolsUsed,
        sources: response.data.sources
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};

export default useChat;
