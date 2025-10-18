import { VectorContentTextDto } from './vector-content-text.dto';

export class VectorContentDto {
  fileId: string;
  fileName: string;
  score: number;
  contents: VectorContentTextDto[];
}

