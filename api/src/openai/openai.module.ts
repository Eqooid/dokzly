import { Module } from '@nestjs/common';
import { FileVectorsService } from './file-vectors/file-vectors.service';
import { FileVectorsController } from './file-vectors/file-vectors.controller';

@Module({
  providers: [FileVectorsService],
  controllers: [FileVectorsController]
})
export class OpenaiModule {}
