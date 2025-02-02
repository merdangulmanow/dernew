import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(FileInterceptor('fileUrl'))
  @Post('/upload-single')
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadSingleFile(file);
  }
}
