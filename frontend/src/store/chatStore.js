import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  sessionId: localStorage.getItem('electiq_session_id') || (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('electiq_session_id', id);
    return id;
  })(),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, { ...message, id: Date.now() }] 
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
  
  clearChat: () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('electiq_session_id', newId);
    set({ messages: [], sessionId: newId, error: null });
  }
}));

export default useChatStore;
