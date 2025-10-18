import { Test, TestingModule } from '@nestjs/testing';
import { FileVectorsService } from './file-vectors.service';

describe('FileVectorsService', () => {
  let service: FileVectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileVectorsService],
    }).compile();

    service = module.get<FileVectorsService>(FileVectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
