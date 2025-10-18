import axios from 'axios';

const url = `${process.env.NEXT_PUBLIC_API_URL}openai/file-vectors`;

export interface VectorStorageDto {
  id: string;
  name: string;
  createdAt: string;
  bytes?: number;
  fileCounts?: {
    inProgress: number;
    completed: number;
    failed: number;
    cancelled: number;
    total: number;
  };
}

export const getVectorStorages = async (): Promise<VectorStorageDto[]> => {
  const response = await axios.get(`${url}/vector-stores`);
  return response.data;
}

export const createVectorStore = async (name: string): Promise<VectorStorageDto> => {
  const response = await axios.post(`${url}/create-store`, { name });
  return response.data;
}

export const deleteVectorStore = async (storeId: string): Promise<boolean> => {
  const response = await axios.delete(`${url}/delete-store/${storeId}`);
  return response.data;
}