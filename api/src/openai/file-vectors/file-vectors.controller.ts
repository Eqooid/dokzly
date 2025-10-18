import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileVectorsService } from './file-vectors.service';
import { VectorStoreDto } from './dtos/vector-store.dto';
import { VectorFileDto } from './dtos/vector-file.dto';
import { CreateStoreDto } from './dtos/create-store.dto';
import { VectorParamsDto } from './dtos/vector-params.dto';
import { VectorFileDetailDto } from './dtos/vector-file-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryVectorDto } from './dtos/query-vector.dto';
import { VectorContentDto } from './dtos/vector-content.dto';
import { VectorChatDto } from './dtos/vector-chat.dto';
import { Response } from 'express';

@Controller('api/v1/openai/file-vectors')
export class FileVectorsController {
  constructor(private fileVectorService: FileVectorsService) {}

  @Get("vector-stores")
  async getVectorStoreList() {
    const data:VectorStoreDto[] = await this.fileVectorService
      .listVectorStores();

    return data;
  }

  @Get("vector-files/:storeId")
  async getVectorFiles(@Param() params: any) {
    const data:VectorFileDto[] = await this.fileVectorService
      .listFilesInVectorStore(params.storeId);

    return data;
  }

  @Post("file-detail")
  async getFileDetailVector(@Body() body: VectorParamsDto) {
    const data:VectorFileDetailDto = await this.fileVectorService
      .getFileDetailsFromVectorStore(body.storeId, body.fileId);

    return data;
  }

  @Post("create-store")
  async createVectorStore(@Body() body: CreateStoreDto) {
    const data:VectorStoreDto = await this.fileVectorService
      .createVectorStore(body.name);
      
    return data;
  }

  @Post("query-vector")
  async queryVectorContent(@Body() body: QueryVectorDto) {
    const data:VectorContentDto[] = await this.fileVectorService
      .queryVectorContent(body.storeId, body.query);
    
    return data;
  }

  @Post("chat")
  async chat(@Body() body: VectorChatDto) {
    return await this.fileVectorService
      .chatVectorContent(body.query, body.input, body.storeId);
  }

  @Post("chat-stream")
  async chatStream(@Body() body: VectorChatDto, @Res() res: Response) {
    console.log("Received chat-stream request:", body);
    const response = await this.fileVectorService
      .chatVectorContent(body.query, body.input, body.storeId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    for (const output of response.output) {
      if (output.type === 'message') {
        output.content.forEach(msg => {
          if (msg.type === 'output_text') {
            let textResponse = JSON.stringify({
              text: msg.text,
              annotations: msg.annotations
            })
            res.write(textResponse);
          }
        });
      }
    }

    res.end();
  }
  
  @Post("upload-file/:storeId")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileToVectorStore(@UploadedFile() file: Express.Multer.File, @Param() params: any) {
    const fileData = new File([new Uint8Array(file.buffer)], file.originalname, {
      type: file.mimetype
    });

    const data:VectorFileDetailDto = await this.fileVectorService
      .uploadFileToVectorStore(params.storeId, fileData);

    return data;
  }

  @Put("update-store-name/:storeId")
  async updateVectorStoreName(@Param() params: any, @Body() body: { name: string }) {
    const data:VectorStoreDto = await this.fileVectorService
      .modifyVectorStore(params.storeId, body.name);
    return data;
  }

  @Delete("delete-store/:storeId")
  async deleteVectorStore(@Param() params: any) {
    const isSuccess:boolean = await this.fileVectorService.
      deleteVectorStore(params.storeId);

    return isSuccess;
  }

  @Delete("delete-file")
  async deleteFileFromVector(@Body() body: VectorParamsDto) {
    const isSuccess:boolean = await this.fileVectorService
      .deleteFileFromVectorStore(body.storeId, body.fileId);
  
    return isSuccess;
  }
}
