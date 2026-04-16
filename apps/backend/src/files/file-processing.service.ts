import { Injectable, Logger } from '@nestjs/common';

import { AzureConfig } from '../config/azure.config';
import { File } from './entities/file.entity';

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);
  private readonly officeMimeTypes = new Set([
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
  ]);

  constructor(private readonly azureConfig: AzureConfig) {}

  async start(file: File, uploadedFile: Express.Multer.File): Promise<void> {
    const pdfBuffer = this.officeMimeTypes.has(uploadedFile.mimetype)
      ? await this.convertPresentationToPdf(uploadedFile)
      : uploadedFile.buffer;

    await this.sendToPdf2Img(file, pdfBuffer);
    this.logger.log(`Queued conversion for fileId=${file.id} userId=${file.userId}`);
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
}
