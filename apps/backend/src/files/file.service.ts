import { randomUUID } from 'node:crypto';

import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import sanitize from 'sanitize-filename';
import type { Repository } from 'typeorm';

import { AzureConfig } from '../config/azure.config';
import { EventsService } from '../events/events.service';
import { File, FileStatus } from './entities/file.entity';
import { FileProcessingService } from './file-processing.service';

export interface FileEvent {
  status: FileStatus;
  eventId: number;
  eventID?: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private userEventStreams = new Map<number, Subject<FileEvent>>();

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private fileProcessingService: FileProcessingService,
    private eventsService: EventsService,
    private azureConfig: AzureConfig,
  ) {}

  async createFile(
    userId: number,
    eventID: string,
    file: Express.Multer.File,
  ): Promise<{ fileId: number; status: FileStatus }> {
    const event = await this.eventsService.findByEventID(userId, eventID);

    const fileEntity = this.fileRepository.create({
      userId,
      eventId: event.id,
      filename: sanitize(file.originalname) || 'Untitled',
      mimeType: file.mimetype,
      size: file.size,
      status: FileStatus.PROCESSING,
      blobPath: '',
      storageKey: randomUUID(),
    });

    const savedFile = await this.fileRepository.save(fileEntity);

    this.emitFileEvent(userId, {
      status: FileStatus.PROCESSING,
      eventId: event.id,
      eventID: event.eventID,
    });

    void this.startProcessing(savedFile, file);

    return {
      fileId: savedFile.id,
      status: savedFile.status,
    };
  }

  async listFilesByEvent(userId: number, eventID: string): Promise<File[]> {
    const event = await this.eventsService.findByEventID(userId, eventID);

    return this.fileRepository.find({
      where: { userId, eventId: event.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getFileById(fileId: number, userId: number, eventID: string): Promise<File> {
    const event = await this.eventsService.findByEventID(userId, eventID);

    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId, eventId: event.id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async updateFileStatus(
    fileId: number,
    userId: number,
    status: FileStatus,
    pageCount?: number | null,
    thumbnailUrl?: string | null,
    error?: string,
    blobUrl?: string,
    blobPath?: string,
  ): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.status = status;
    if (pageCount !== undefined) {
      file.pageCount = pageCount;
    }
    if (thumbnailUrl !== undefined) {
      file.thumbnailUrl = thumbnailUrl;
    }
    if (blobUrl !== undefined) {
      file.blobUrl = blobUrl;
    }
    if (blobPath !== undefined) {
      file.blobPath = blobPath;
    }

    await this.fileRepository.save(file);

    this.emitFileEvent(userId, {
      status,
      eventId: file.eventId,
    });
  }

  async deleteFile(fileId: number, userId: number, eventID: string): Promise<void> {
    const file = await this.getFileById(fileId, userId, eventID);

    if (file.blobPath) {
      try {
        const blobClient = BlobServiceClient.fromConnectionString(
          this.azureConfig.storageConnectionString,
        )
          .getContainerClient(this.azureConfig.containerName)
          .getBlobClient(file.blobPath);
        await blobClient.deleteIfExists();
      } catch (error) {
        this.logger.warn(`Failed to delete blob for fileId=${fileId}: ${String(error)}`);
      }
    }

    await this.fileRepository.remove(file);
  }

  async renameFile(
    fileId: number,
    userId: number,
    eventID: string,
    filename: string,
  ): Promise<File> {
    const file = await this.getFileById(fileId, userId, eventID);
    file.filename = sanitize(filename) || file.filename;
    return this.fileRepository.save(file);
  }

  getFileEventsStream(userId: number): Subject<FileEvent> {
    if (!this.userEventStreams.has(userId)) {
      this.userEventStreams.set(userId, new Subject<FileEvent>());
    }
    return this.userEventStreams.get(userId)!;
  }

  private emitFileEvent(userId: number, event: FileEvent): void {
    const stream = this.userEventStreams.get(userId);
    if (stream) {
      stream.next(event);
    }
  }

  private async startProcessing(file: File, uploadedFile: Express.Multer.File): Promise<void> {
    try {
      await this.fileProcessingService.start(file, uploadedFile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown processing error';
      await this.updateFileStatus(file.id, file.userId, FileStatus.FAILED, null, null, message);
    }
  }
}
