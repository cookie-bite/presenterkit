import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';

import { AzureConfig } from '../config/azure.config';
import { File } from './entities/file.entity';
import { isImageMimeType, isOfficeMimeType, isVideoMimeType } from './file-types.constants';

type ProcessingResult =
  | { type: 'queued' }
  | { type: 'uploaded'; blobUrl: string; blobPath: string; thumbnailUrl: string | null };

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);
  private readonly containerClient: ContainerClient;

  constructor(private readonly azureConfig: AzureConfig) {
    this.containerClient = BlobServiceClient.fromConnectionString(
      azureConfig.storageConnectionString,
    ).getContainerClient(azureConfig.containerName);
  }

  async start(file: File, uploadedFile: Express.Multer.File): Promise<ProcessingResult> {
    if (isImageMimeType(uploadedFile.mimetype) || isVideoMimeType(uploadedFile.mimetype)) {
      const result = await this.uploadDirectlyToBlob(file, uploadedFile);
      this.logger.log(`Direct upload complete for fileId=${file.id} userId=${file.userId}`);
      return { type: 'uploaded', ...result };
    }

    const pdfBuffer = isOfficeMimeType(uploadedFile.mimetype)
      ? await this.convertPresentationToPdf(uploadedFile)
      : uploadedFile.buffer;

    await this.sendToPdf2Img(file, pdfBuffer);
    this.logger.log(`Queued conversion for fileId=${file.id} userId=${file.userId}`);
    return { type: 'queued' };
  }

  private async uploadDirectlyToBlob(
    file: File,
    uploadedFile: Express.Multer.File,
  ): Promise<{ blobUrl: string; blobPath: string; thumbnailUrl: string | null }> {
    if (!file.storageKey) {
      throw new Error(`storageKey is missing for fileId=${file.id}`);
    }

    const folder = isImageMimeType(uploadedFile.mimetype) ? 'image' : 'video';
    const ext = this.getExtension(uploadedFile.originalname);
    const sourceBlobPath = this.buildBlobPath(file.storageKey, folder, `source.${ext}`);

    const sourceBlobClient = this.containerClient.getBlockBlobClient(sourceBlobPath);
    await sourceBlobClient.uploadData(uploadedFile.buffer, {
      blobHTTPHeaders: {
        blobContentType: uploadedFile.mimetype,
        blobCacheControl: 'max-age=86400',
      },
    });
    const blobUrl = sourceBlobClient.url;

    let thumbnailUrl: string | null = null;

    if (isImageMimeType(uploadedFile.mimetype)) {
      thumbnailUrl = blobUrl;
    } else {
      const thumbnailBuffer = await this.extractVideoThumbnail(uploadedFile.buffer);
      if (thumbnailBuffer) {
        const thumbBlobPath = this.buildBlobPath(file.storageKey, 'image', 'thumbnail.webp');
        const thumbBlobClient = this.containerClient.getBlockBlobClient(thumbBlobPath);
        await thumbBlobClient.uploadData(thumbnailBuffer, {
          blobHTTPHeaders: {
            blobContentType: 'image/webp',
            blobCacheControl: 'max-age=86400',
          },
        });
        thumbnailUrl = thumbBlobClient.url;
      }
    }

    return { blobUrl, blobPath: sourceBlobPath, thumbnailUrl };
  }

  private async extractVideoThumbnail(videoBuffer: Buffer): Promise<Buffer | null> {
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `${randomUUID()}.tmp`);
    const outputPath = join(tempDir, `${randomUUID()}.webp`);

    try {
      await fs.writeFile(inputPath, videoBuffer);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .inputOptions(['-ss', '1'])
          .outputOptions(['-frames:v', '1', '-update', '1'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .run();
      });

      return await fs.readFile(outputPath);
    } catch (error) {
      this.logger.warn(`FFmpeg thumbnail extraction failed: ${String(error)}`);
      return null;
    } finally {
      await Promise.allSettled([
        fs.unlink(inputPath).catch(() => undefined),
        fs.unlink(outputPath).catch(() => undefined),
      ]);
    }
  }

  private async convertPresentationToPdf(file: Express.Multer.File): Promise<Buffer> {
    this.logger.log('Starting PPT/PPTX conversion via Gotenberg.');
    const formData = new FormData();
    const bytes = new Uint8Array(file.buffer);
    formData.append('files', new Blob([bytes], { type: file.mimetype }), file.originalname);

    const response = await fetch(`${this.azureConfig.libreofficeUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      throw new Error(`Gotenberg conversion failed with status ${response.status}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  private async sendToPdf2Img(file: File, pdfBuffer: Buffer): Promise<void> {
    if (!file.storageKey) {
      throw new Error(`storageKey is missing for fileId=${file.id}`);
    }

    const targetUrl =
      `${this.azureConfig.pdf2imgUrl}/convert` +
      `?fileId=${file.id}` +
      `&userId=${file.userId}` +
      `&storageKey=${encodeURIComponent(file.storageKey)}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: new Uint8Array(pdfBuffer),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      throw new Error(`pdf2img request failed with status ${response.status}`);
    }
  }

  private buildBlobPath(storageKey: string, folder: string, fileName: string): string {
    const prefix = this.azureConfig.blobPathPrefix?.trim().replace(/^\/|\/$/g, '');
    return prefix
      ? `${prefix}/${storageKey}/${folder}/${fileName}`
      : `${storageKey}/${folder}/${fileName}`;
  }

  private getExtension(filename: string): string {
    const ext = extname(filename).replace('.', '').toLowerCase();
    return ext || 'bin';
  }
}
