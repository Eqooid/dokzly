import { create } from 'zustand';

export interface VectorStoreDto {
  id: string;
  name: string;
  createdAt: string;
}

interface VectorStoreState {
  data: VectorStoreDto[];
  singleData?: VectorStoreDto;
  initData: () => void;
  add: (name:string) => void;
  isLoading?: boolean;
  deleteData: (storageId: string) => void;
  updateData?: (storageId: string, name: string) => void;
}

const useVectorStore = create<VectorStoreState>(set => ({
  data: [],
  isLoading: false,
  singleData: undefined,
  initData: async () => {
    set({ data: [], isLoading: true });
    const response = await fetch(`/api/vector-storage`);
    const data = await response.json();
    set({ data, isLoading: false });
  },
  add: async (name: string) => {
    const response = await fetch(`/api/vector-storage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const newStore = await response.json();
    set(state => ({ data: [newStore, ...state.data ] }));
  },
  deleteData: async (storageId: string) => {
    set({ isLoading: true });
    const response = await fetch(`/api/vector-storage/${storageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ storageId })
    });
    const result = await response.json();
    if (result) {
      set(state => ({
        data: state.data.filter(store => store.id !== storageId),
        isLoading: false
      }));
    } else {
      set({ isLoading: false });
    }
  },
  updateData: async (storageId: string, name: string) => {
    set({ isLoading: true });
    const response = await fetch(`/api/vector-storage/${storageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const updatedStore = await response.json();
    set(state => ({
      data: state.data.map(store => store.id === storageId ? updatedStore : store),
      isLoading: false
    }));
  }
}))

export default useVectorStore;