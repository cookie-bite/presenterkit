import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from '../files/file.service';
import { isAllowedMimeType } from '../files/file-types.constants';
import { UploadTokenGuard } from './upload-token.guard';

@Controller('upload')
@UseGuards(UploadTokenGuard)
export class PublicUploadController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getUploadPage(@Request() req): { eventName: string } {
    return { eventName: req.uploadEvent.name };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadViaLink(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadedBy') uploadedBy?: string,
  ): Promise<{ fileId: number; status: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!isAllowedMimeType(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images, videos, and PDFs are allowed.',
      );
    }

    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds maximum limit of 200MB');
    }

    const { userId, eventID } = req.uploadEvent;
    const uploaderName = uploadedBy?.trim() || 'Guest';

    const result = await this.fileService.createFile(userId, eventID, file, uploaderName);
    return { fileId: result.fileId, status: result.status };
  }
}
