import {
  Body,
  Controller,
  Get,
  Headers,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Sse,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { map, Observable } from 'rxjs';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AzureConfig } from '../config/azure.config';
import { FileResponseDto } from './dto/file-response.dto';
import { WebhookFileProcessedDto } from './dto/webhook-file-processed.dto';
import { FileStatus } from './entities/file.entity';
import { FileService } from './file.service';
import { JwtQueryGuard } from './guards/jwt-query.guard';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileId: number; status: string }> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/',
      'video/',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ];
    const isValidType = allowedMimeTypes.some(type => file.mimetype.startsWith(type));
    if (!isValidType) {
      throw new Error('Invalid file type. Only images, videos, and PDFs are allowed.');
    }

    // Validate file size (200MB)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds maximum limit of 200MB');
    }

    const userId = req.user.userId;
    const result = await this.fileService.createFile(userId, file);

    return {
      fileId: result.fileId,
      status: result.status,
    };
  }

  @Get('events')
  @UseGuards(JwtQueryGuard)
  @Sse('events')
  sse(@Request() req): Observable<MessageEvent> {
    const userId = req.user.userId;
    const stream = this.fileService.getFileEventsStream(userId);

    return stream.pipe(
      map(
        (data): MessageEvent => ({
          data: JSON.stringify({ status: data.status }),
          type: this.getEventType(data.status),
        }),
      ),
    );
  }

  @Get(':fileId')
  @UseGuards(JwtAuthGuard)
  async getFile(
    @Request() req,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<FileResponseDto> {
    const userId = req.user.userId;
    const file = await this.fileService.getFileById(fileId, userId);

    return {
      fileId: file.id,
      status: file.status,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      blobUrl: file.blobUrl,
      blobPath: file.blobPath,
      storageKey: file.storageKey,
      pageCount: file.pageCount,
      thumbnailUrl: file.thumbnailUrl,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  private getEventType(status: FileStatus): string {
    switch (status) {
      case FileStatus.PROCESSING:
        return 'FILE_UPLOADED';
      case FileStatus.READY:
        return 'FILE_READY';
      case FileStatus.FAILED:
        return 'FILE_FAILED';
      default:
        return 'FILE_UPDATE';
    }
  }
}

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly fileService: FileService,
    private readonly azureConfig: AzureConfig,
  ) {}

  @Post('file-processed')
  async handleFileProcessed(
    @Headers('x-webhook-secret') secret: string,
    @Body() dto: WebhookFileProcessedDto,
  ): Promise<{ success: boolean }> {
    // Validate webhook secret
    if (secret !== this.azureConfig.webhookSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    await this.fileService.updateFileStatus(
      dto.fileId,
      dto.userId,
      dto.status,
      dto.pageCount,
      dto.thumbnailUrl,
      dto.error,
      dto.blobUrl,
      dto.blobPath,
    );

    return { success: true };
  }
}
