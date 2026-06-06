import { promises as fs } from 'node:fs';

import { BlobServiceClient } from '@azure/storage-blob';
import ffmpeg from 'fluent-ffmpeg';

import { AzureConfig } from '../../config/azure.config';
import { FileProcessingService } from '../file-processing.service';

jest.mock('node:fs', () => {
  const actual = jest.requireActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    promises: {
      writeFile: jest.fn().mockResolvedValue(undefined),
      readFile: jest.fn(),
      unlink: jest.fn().mockResolvedValue(undefined),
    },
  };
});

jest.mock('fluent-ffmpeg');

/**
 * Builds a fluent-ffmpeg mock command that fires 'end' or 'error' synchronously
 * when .run() is called, simulating a successful or failed ffmpeg invocation.
 */
function makeFfmpegCommand(outcome: 'end' | 'error') {
  const callbacks: Record<string, (...args: unknown[]) => void> = {};
  const cmd = {
    inputOptions: jest.fn().mockReturnThis(),
    outputOptions: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((event: string, cb: (...args: unknown[]) => void) => {
      callbacks[event] = cb;
      return cmd;
    }),
    run: jest.fn().mockImplementation(() => {
      if (outcome === 'end') callbacks['end']?.();
      else callbacks['error']?.(new Error('ffmpeg error'));
    }),
  };
  return cmd;
}

describe('FileProcessingService', () => {
  const originalFetch = global.fetch;

  const mockSourceBlobClient = {
    uploadData: jest.fn(),
    url: 'https://blob/source',
  };
  const mockContainerClient = {
    getBlockBlobClient: jest.fn().mockReturnValue(mockSourceBlobClient),
  };

  const mockAzureConfig = {
    storageConnectionString: 'UseDevelopmentStorage=true',
    containerName: 'container',
    libreofficeUrl: 'http://localhost:3001',
    pdf2imgUrl: 'http://localhost:3002',
    blobPathPrefix: 'dev',
  } as AzureConfig;

  beforeEach(() => {
    jest.spyOn(BlobServiceClient, 'fromConnectionString').mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    } as never);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('images', () => {
    it('should upload directly and use the blob url as thumbnail', async () => {
      const service = new FileProcessingService(mockAzureConfig);

      const result = await service.start(
        { id: 9, userId: 4, storageKey: 'sk' } as never,
        {
          mimetype: 'image/png',
          originalname: 'img.png',
          buffer: Buffer.from('x'),
        } as Express.Multer.File,
      );

      expect(result).toEqual({
        type: 'uploaded',
        blobUrl: 'https://blob/source',
        blobPath: 'dev/sk/image/source.png',
        thumbnailUrl: 'https://blob/source',
        thumbnailWidth: null,
        thumbnailHeight: null,
      });
      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'dev/sk/image/source.png',
      );
      expect(mockSourceBlobClient.uploadData).toHaveBeenCalledTimes(1);
    });
  });

  describe('videos', () => {
    it('should transcode to mp4 and upload as source.mp4 with video/mp4 content-type', async () => {
      const service = new FileProcessingService(mockAzureConfig);
      const transcodedBuffer = Buffer.from('transcoded-mp4');
      const thumbnailBuffer = Buffer.from('thumbnail-webp');

      jest
        .mocked(ffmpeg)
        .mockReturnValueOnce(makeFfmpegCommand('end') as never) // transcoding
        .mockReturnValueOnce(makeFfmpegCommand('end') as never); // thumbnail
      jest
        .mocked(fs.readFile)
        .mockResolvedValueOnce(transcodedBuffer as never)
        .mockResolvedValueOnce(thumbnailBuffer as never);

      const result = await service.start(
        { id: 1, userId: 2, storageKey: 'sk' } as never,
        {
          mimetype: 'video/mp4',
          originalname: 'clip.mp4',
          buffer: Buffer.from('raw-video'),
        } as Express.Multer.File,
      );

      expect(result).toMatchObject({
        type: 'uploaded',
        blobPath: 'dev/sk/video/source.mp4',
        thumbnailUrl: 'https://blob/source',
      });
      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
        'dev/sk/video/source.mp4',
      );
      expect(mockSourceBlobClient.uploadData).toHaveBeenCalledWith(
        transcodedBuffer,
        expect.objectContaining({
          blobHTTPHeaders: expect.objectContaining({ blobContentType: 'video/mp4' }),
        }),
      );
    });

    it('should transcode non-mp4 video (e.g. .mov) and store as source.mp4', async () => {
      const service = new FileProcessingService(mockAzureConfig);

      jest
        .mocked(ffmpeg)
        .mockReturnValueOnce(makeFfmpegCommand('end') as never)
        .mockReturnValueOnce(makeFfmpegCommand('end') as never);
      jest
        .mocked(fs.readFile)
        .mockResolvedValueOnce(Buffer.from('transcoded') as never)
        .mockResolvedValueOnce(Buffer.from('thumb') as never);

      const result = await service.start(
        { id: 1, userId: 2, storageKey: 'sk' } as never,
        {
          mimetype: 'video/quicktime',
          originalname: 'clip.mov',
          buffer: Buffer.from('raw'),
        } as Express.Multer.File,
      );

      expect(result).toMatchObject({ type: 'uploaded', blobPath: 'dev/sk/video/source.mp4' });
    });

    it('should pass transcoded buffer (not original) to thumbnail extraction', async () => {
      const service = new FileProcessingService(mockAzureConfig);
      const transcodedBuffer = Buffer.from('transcoded-mp4');

      jest
        .mocked(ffmpeg)
        .mockReturnValueOnce(makeFfmpegCommand('end') as never)
        .mockReturnValueOnce(makeFfmpegCommand('end') as never);
      jest
        .mocked(fs.readFile)
        .mockResolvedValueOnce(transcodedBuffer as never)
        .mockResolvedValueOnce(Buffer.from('thumb') as never);

      await service.start(
        { id: 1, userId: 2, storageKey: 'sk' } as never,
        {
          mimetype: 'video/mp4',
          originalname: 'clip.mp4',
          buffer: Buffer.from('original-raw'),
        } as Express.Multer.File,
      );

      // The second fs.writeFile call (thumbnail input) should use the transcoded buffer
      const writeFileCalls = jest.mocked(fs.writeFile).mock.calls;
      expect(writeFileCalls[1][1]).toBe(transcodedBuffer);
    });

    it('should fall back to the original file when transcoding fails', async () => {
      const service = new FileProcessingService(mockAzureConfig);
      const originalBuffer = Buffer.from('original-mov');

      jest
        .mocked(ffmpeg)
        .mockReturnValueOnce(makeFfmpegCommand('error') as never) // transcoding fails
        .mockReturnValueOnce(makeFfmpegCommand('end') as never); // thumbnail succeeds
      jest.mocked(fs.readFile).mockResolvedValueOnce(Buffer.from('thumb') as never);

      const result = await service.start(
        { id: 1, userId: 2, storageKey: 'sk' } as never,
        {
          mimetype: 'video/quicktime',
          originalname: 'clip.mov',
          buffer: originalBuffer,
        } as Express.Multer.File,
      );

      expect(result).toMatchObject({ type: 'uploaded', blobPath: 'dev/sk/video/source.mov' });
      expect(mockSourceBlobClient.uploadData).toHaveBeenCalledWith(
        originalBuffer,
        expect.objectContaining({
          blobHTTPHeaders: expect.objectContaining({ blobContentType: 'video/quicktime' }),
        }),
      );
    });

    it('should still produce a result when both transcoding and thumbnail extraction fail', async () => {
      const service = new FileProcessingService(mockAzureConfig);

      jest
        .mocked(ffmpeg)
        .mockReturnValueOnce(makeFfmpegCommand('error') as never) // transcoding fails
        .mockReturnValueOnce(makeFfmpegCommand('error') as never); // thumbnail also fails

      const result = await service.start(
        { id: 1, userId: 2, storageKey: 'sk' } as never,
        {
          mimetype: 'video/mp4',
          originalname: 'clip.mp4',
          buffer: Buffer.from('raw'),
        } as Express.Multer.File,
      );

      expect(result).toMatchObject({
        type: 'uploaded',
        blobPath: 'dev/sk/video/source.mp4',
        thumbnailUrl: null,
      });
    });
  });

  describe('office / pdf files', () => {
    it('should queue conversion for pdf files', async () => {
      const service = new FileProcessingService(mockAzureConfig);
      global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response);

      const result = await service.start(
        { id: 9, userId: 4, storageKey: 'sk' } as never,
        {
          mimetype: 'application/pdf',
          originalname: 'deck.pdf',
          buffer: Buffer.from('pdf'),
        } as Express.Multer.File,
      );

      expect(result).toEqual({ type: 'queued' });
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
