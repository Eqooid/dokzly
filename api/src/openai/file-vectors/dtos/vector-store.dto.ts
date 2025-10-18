import { VectorStoreCountDto } from "./vector-store-counts";

export class VectorStoreDto {
  id: string;
  name: string;
  createdAt: Date;
  bytes: number;
  fileCounts: VectorStoreCountDto;
}