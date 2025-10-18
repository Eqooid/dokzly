import { create } from 'zustand';

export interface VectorFileDto {
  id: string;
  createdAt: string;
}

interface VectorFileState {
  data: VectorFileDto[];
  initData: (storeId: string) => void;
  isLoading?: boolean;
  deleteData?: (id: string, storeId: string) => Promise<void>;
  uploadFile?: (storeId: string, file: File) => Promise<void>;
}

const useVectorFile = create<VectorFileState>((set, get) => ({
  data: [],
  isLoading: false,
  initData: async (storeId: string) => {
    set({ data: [], isLoading: true });
    const response = await fetch(`/api/vector-file?storeId=${storeId}`);
    const data = await response.json();
    set({ data, isLoading: false });
  },
  deleteData: async (id: string, storeId: string) => {
    set({ isLoading: true });
    await fetch(`/api/vector-file/`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId:id, storeId }),
      duplex: 'half' 
    } as any);
    const newData = get().data.filter(item => item.id !== id);
    set({ data: newData, isLoading: false });
  },
  uploadFile: async (storeId: string, file: File) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append('file', file);
    await fetch(`/api/vector-file/${storeId}`, {
      method: 'POST',
      body: formData
    });
    get().initData(storeId);
  }
}));

export default useVectorFile;