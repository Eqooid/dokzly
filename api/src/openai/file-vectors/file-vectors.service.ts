import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { VectorContentDto } from './dtos/vector-content.dto';
import { VectorStoreDto } from './dtos/vector-store.dto';
import { VectorFileDetailDto } from './dtos/vector-file-detail.dto';
import { VectorFileDto } from './dtos/vector-file.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileVectorsService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY')
    this.openai = new OpenAI({apiKey});
  }

  async chatWithStreamedVectorContent(query: string, input:any[], storeId: string, res: Response) : Promise<any> {
    input = input || [];
    
    const stream = await this.openai.responses.create({
      model: 'gpt-4.1-nano',
      stream: true,
      store: true,
      input: [...input,{ role: 'user', content: query }],
      tools: [
        {
          type: 'file_search',
          vector_store_ids: [storeId]
        }
      ]
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const event of stream) {
      if (event.type === 'response.output_text.delta'){
        res.write(event.delta);
      }
    }

    res.end();
  }

  async chatVectorContent(query: string, input: any[], storeId: string) {
     const response = await this.openai.responses.create({
      model: 'gpt-4.1-nano',
      store: true,
      input: [...input,{ role: 'user', content: query }],
      tools: [
        {
          type: 'file_search',
          vector_store_ids: [storeId]
        }
      ]
    });

    return {
      id: response.id,
      prompt: response.prompt,
      output: response.output
    }
  }

  async queryVectorContent(storeId: string, query: string) : Promise<VectorContentDto[]>{
    const response = await this.openai.vectorStores.search(storeId, {
      query
    });

    return response.data.map(item => ({
      fileId: item.file_id,
      fileName: item.filename,
      score: item.score,
      contents: item.content.map(content => ({
        text: content.text,
        type: content.type
      }))
    }));
  }

  async createVectorStore(name: string) : Promise<VectorStoreDto> {
    const response = await this.openai.vectorStores.create({
      name
    });

    return {
      id: response.id,
      name: response.name, 
      createdAt: new Date(response.created_at * 1000), 
      bytes: response.usage_bytes, 
      fileCounts: {
        inProgress: response.file_counts.in_progress, 
        completed: response.file_counts.completed, 
        failed: response.file_counts.failed, 
        cancelled: response.file_counts.cancelled, 
        total: response.file_counts.total
      }
    };
  }

  async listVectorStores() : Promise<VectorStoreDto[]> {
    const response = await this.openai.vectorStores.list();

    return response.data.map(store => ({
      id: store.id,
      name: store.name, 
      createdAt: new Date(store.created_at * 1000),
      bytes: store.usage_bytes,
      fileCounts: {
        inProgress: store.file_counts.in_progress,
        completed: store.file_counts.completed,
        failed: store.file_counts.failed,
        cancelled: store.file_counts.cancelled,
        total: store.file_counts.total
      }
    }))
  };

  async modifyVectorStore(storeId: string, name: string) : Promise<VectorStoreDto> {
    const response = await this.openai.vectorStores.update(storeId, {
      name
    });

    return {
      id: response.id,
      name: response.name,
      createdAt: new Date(response.created_at * 1000),
      bytes: response.usage_bytes,
      fileCounts: {
        inProgress: response.file_counts.in_progress,
        completed: response.file_counts.completed,
        failed: response.file_counts.failed,
        cancelled: response.file_counts.cancelled,
        total: response.file_counts.total
      }
    };
  }

  async deleteVectorStore(storeId: string) : Promise<boolean> {
    const response = await this.openai.vectorStores.delete(storeId);
    return response.deleted;
  }

  async uploadFileToVectorStore(storeId: string, file: File) : Promise<VectorFileDetailDto> {
    console.log(file);
    const fileResponse = await this.openai.files.create({
      file: file,
      purpose: 'assistants'
    });

    const vectorResponse = await this.openai.vectorStores.files.create(storeId, {
      file_id: fileResponse.id
    });

    return {
      id: vectorResponse.id,
      filename: fileResponse.filename,
      object: vectorResponse.object,
      createdAt: new Date(vectorResponse.created_at * 1000),
      usageBytes: vectorResponse.usage_bytes,
      vectorStoreId: vectorResponse.vector_store_id,
      status: vectorResponse.status,
    };
  }
  
  async listFilesInVectorStore(storeId: string) : Promise<VectorFileDto[]> {
    const response = await this.openai.vectorStores.files.list(storeId);
    
    return response.data.map(file => ({
      id: file.id,
      object: file.object,
      createdAt: new Date(file.created_at * 1000),
      vectorStoreId: file.vector_store_id
    }));
  }

  async deleteFileFromVectorStore(storeId: string, fileId: string) : Promise<boolean> {
    const response = await this.openai.vectorStores.files.delete(fileId, {
      vector_store_id: storeId
    });
    await this.openai.files.delete(fileId);
    return response.deleted;
  }

  async getFileDetailsFromVectorStore(storeId: string, fileId: string) : Promise<VectorFileDetailDto> {
    const response = await this.openai.vectorStores.files.retrieve(fileId, {
      vector_store_id: storeId
    });

    const fileMeta = await this.openai.files.retrieve(fileId);

    return {
      id: response.id,
      filename: fileMeta.filename,
      object: response.object,
      createdAt: new Date(response.created_at * 1000),
      usageBytes: response.usage_bytes,
      vectorStoreId: response.vector_store_id,
      status: response.status,
    }
  }
}
