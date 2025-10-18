export class VectorFileDetailDto {
  id: string;
  filename: string;
  object: string;
  createdAt: Date;
  usageBytes: number;
  vectorStoreId: string;
  status: string;
}