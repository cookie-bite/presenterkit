import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { imageSize } from 'image-size';

import { AzureConfig } from '../config/azure.config';
import { File } from './entities/file.entity';
import {
  isAudioMimeType,
  isImageMimeType,
  isOfficeMimeType,
  isVideoMimeType,
} from './file-types.constants';

type ProcessingResult =
  | { type: 'queued' }
  | {
      type: 'uploaded';
      blobUrl: string;
      blobPath: string;
      thumbnailUrl: string | null;
      thumbnailWidth: number | null;
      thumbnailHeight: number | null;
      duration: number | null;
    };

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
    if (
      isImageMimeType(uploadedFile.mimetype) ||
      isVideoMimeType(uploadedFile.mimetype) ||
      isAudioMimeType(uploadedFile.mimetype)
    ) {
      const result = await this.uploadDirectlyToBlob(file, uploadedFile);
      this.logger.log(
        {
          userId: file.userId,
          fileId: file.id,
          mimeType: uploadedFile.mimetype,
          action: 'blob_upload_direct',
        },
        'Direct upload to blob finished',
      );
      return { type: 'uploaded', ...result };
    }

    const pdfBuffer = isOfficeMimeType(uploadedFile.mimetype)
      ? await this.convertPresentationToPdf(uploadedFile, {
          userId: file.userId,
          fileId: file.id,
        })
      : uploadedFile.buffer;

    await this.sendToPdf2Img(file, pdfBuffer);
    this.logger.log(
      {
        userId: file.userId,
        fileId: file.id,
        mimeType: uploadedFile.mimetype,
        action: 'pdf2img_queue',
      },
      'Queued pdf2img conversion',
    );
    return { type: 'queued' };
  }

  private async uploadDirectlyToBlob(
    file: File,
    uploadedFile: Express.Multer.File,
  ): Promise<{
    blobUrl: string;
    blobPath: string;
    thumbnailUrl: string | null;
    thumbnailWidth: number | null;
    thumbnailHeight: number | null;
    duration: number | null;
  }> {
    if (!file.storageKey) {
      throw new Error(`storageKey is missing for fileId=${file.id}`);
    }

    if (isAudioMimeType(uploadedFile.mimetype)) {
      return this.uploadAudioToBlob(file, uploadedFile);
    }

    const folder = isImageMimeType(uploadedFile.mimetype) ? 'image' : 'video';

    let uploadBuffer: Buffer;
    let uploadMimeType: string;
    let blobExt: string;

    if (isVideoMimeType(uploadedFile.mimetype)) {
      const transcoded = await this.transcodeVideoToMp4(uploadedFile.buffer, {
        userId: file.userId,
        fileId: file.id,
      });
      if (transcoded) {
        uploadBuffer = transcoded;
        uploadMimeType = 'video/mp4';
        blobExt = 'mp4';
      } else {
        uploadBuffer = uploadedFile.buffer;
        uploadMimeType = uploadedFile.mimetype;
        blobExt = this.getExtension(uploadedFile.originalname);
      }
    } else {
      uploadBuffer = uploadedFile.buffer;
      uploadMimeType = uploadedFile.mimetype;
      blobExt = this.getExtension(uploadedFile.originalname);
    }

    const sourceBlobPath = this.buildBlobPath(file.storageKey, folder, `source.${blobExt}`);

    const sourceBlobClient = this.containerClient.getBlockBlobClient(sourceBlobPath);
    await sourceBlobClient.uploadData(uploadBuffer, {
      blobHTTPHeaders: {
        blobContentType: uploadMimeType,
        blobCacheControl: 'max-age=86400',
      },
    });
    const blobUrl = sourceBlobClient.url;

    let thumbnailUrl: string | null = null;
    let thumbnailWidth: number | null = null;
    let thumbnailHeight: number | null = null;

    if (isImageMimeType(uploadedFile.mimetype)) {
      thumbnailUrl = blobUrl;
      const dims = this.readImageDimensions(uploadedFile.buffer);
      thumbnailWidth = dims.width;
      thumbnailHeight = dims.height;
    } else {
      const thumbnailBuffer = await this.extractVideoThumbnail(uploadBuffer, {
        userId: file.userId,
        fileId: file.id,
      });
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
        const dims = this.readImageDimensions(thumbnailBuffer);
        thumbnailWidth = dims.width;
        thumbnailHeight = dims.height;
      }
    }

    return {
      blobUrl,
      blobPath: sourceBlobPath,
      thumbnailUrl,
      thumbnailWidth,
      thumbnailHeight,
      duration: null,
    };
  }

  private async uploadAudioToBlob(
    file: File,
    uploadedFile: Express.Multer.File,
  ): Promise<{
    blobUrl: string;
    blobPath: string;
    thumbnailUrl: null;
    thumbnailWidth: null;
    thumbnailHeight: null;
    duration: number | null;
  }> {
    const ctx = { userId: file.userId, fileId: file.id };
    const { mp3Buffer, duration } = await this.transcodeAudioToMp3(uploadedFile.buffer, ctx);

    const blobPath = this.buildBlobPath(file.storageKey!, 'audio', 'source.mp3');
    const blobClient = this.containerClient.getBlockBlobClient(blobPath);
    await blobClient.uploadData(mp3Buffer, {
      blobHTTPHeaders: {
        blobContentType: 'audio/mpeg',
        blobCacheControl: 'max-age=86400',
      },
    });

    this.logger.log({ ...ctx, action: 'audio_transcode' }, 'Audio transcoded and uploaded');

    return {
      blobUrl: blobClient.url,
      blobPath,
      thumbnailUrl: null,
      thumbnailWidth: null,
      thumbnailHeight: null,
      duration,
    };
  }

  private readImageDimensions(buffer: Buffer): { width: number | null; height: number | null } {
    try {
      const { width, height } = imageSize(buffer);
      return { width: width ?? null, height: height ?? null };
    } catch {
      return { width: null, height: null };
    }
  }

  private async extractVideoThumbnail(
    videoBuffer: Buffer,
    ctx: { userId: number; fileId: number },
  ): Promise<Buffer | null> {
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
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn({ err, ...ctx }, 'FFmpeg thumbnail extraction failed');
      return null;
    } finally {
      await Promise.allSettled([
        fs.unlink(inputPath).catch(() => undefined),
        fs.unlink(outputPath).catch(() => undefined),
      ]);
    }
  }

  private async transcodeVideoToMp4(
    videoBuffer: Buffer,
    ctx: { userId: number; fileId: number },
  ): Promise<Buffer | null> {
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `${randomUUID()}.tmp`);
    const outputPath = join(tempDir, `${randomUUID()}.mp4`);

    try {
      await fs.writeFile(inputPath, videoBuffer);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(['-vcodec', 'libx264', '-movflags', '+faststart', '-acodec', 'aac'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .run();
      });

      return await fs.readFile(outputPath);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn({ err, ...ctx }, 'FFmpeg video transcoding failed, using original');
      return null;
    } finally {
      await Promise.allSettled([
        fs.unlink(inputPath).catch(() => undefined),
        fs.unlink(outputPath).catch(() => undefined),
      ]);
    }
  }

  private async transcodeAudioToMp3(
    audioBuffer: Buffer,
    ctx: { userId: number; fileId: number },
  ): Promise<{ mp3Buffer: Buffer; duration: number | null }> {
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `${randomUUID()}.tmp`);
    const outputPath = join(tempDir, `${randomUUID()}.mp3`);

    try {
      await fs.writeFile(inputPath, audioBuffer);

      let duration: number | null = null;

      await new Promise<void>((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
          if (!err) {
            duration = metadata.format.duration ?? null;
          }
          resolve();
        });
      });

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(['-codec:a', 'libmp3lame', '-b:a', '192k', '-ac', '2', '-ar', '44100'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .run();
      });

      const mp3Buffer = await fs.readFile(outputPath);
      return { mp3Buffer, duration };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn({ err, ...ctx }, 'FFmpeg audio transcoding failed');
      throw err;
    } finally {
      await Promise.allSettled([
        fs.unlink(inputPath).catch(() => undefined),
        fs.unlink(outputPath).catch(() => undefined),
      ]);
    }
  }

  private async convertPresentationToPdf(
    file: Express.Multer.File,
    ctx: { userId: number; fileId: number },
  ): Promise<Buffer> {
    this.logger.log(
      { ...ctx, action: 'gotenberg_convert' },
      'Starting PPT/PPTX conversion via Gotenberg',
    );
    const formData = new FormData();
    const bytes = new Uint8Array(file.buffer);
    formData.append('files', new Blob([bytes], { type: file.mimetype }), file.originalname);

    const response = await fetch(`${this.azureConfig.libreofficeUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      this.logger.error(
        {
          userId: ctx.userId,
          fileId: ctx.fileId,
          httpStatus: response.status,
          action: 'gotenberg_convert',
        },
        'Gotenberg conversion failed',
      );
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
      this.logger.error(
        {
          userId: file.userId,
          fileId: file.id,
          httpStatus: response.status,
          action: 'pdf2img',
        },
        'pdf2img request failed',
      );
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
