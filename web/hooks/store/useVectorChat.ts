import { create } from 'zustand';

export interface Message {
  role: string;
  content: string;
}

interface VectorChatState {
  init: () => void;
  messages: Message[];
  sendMessage: (storeId: string, message: string) => Promise<void>;
}

const useVectorChat = create<VectorChatState>((set, get) => ({
  messages: [],
  init: async () => {
    set({ messages: [] });
  },
  sendMessage: async (storeId: string, message: string) => {
    set({ messages: [...get().messages, { role: 'user', content: message }] });
    const response = await fetch('/api/vector-chat', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ storeId, query: message, input: [] })
    });
    const data = await response.json();
 
    data.output.forEach((output:any) => {
      if (output.type === 'message') {
        output.content.forEach((msg: any) => {
          if (msg.type === 'output_text') {
            set({ messages: [...get().messages, {
              role: 'assistant', content: msg.text
            }]});
          }
        });
      }
    });
  }
}));

export default useVectorChat;