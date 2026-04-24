import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { firstValueFrom, Subject } from 'rxjs';

import { AzureConfig } from '../../config/azure.config';
import { WebhookFileProcessedDto } from '../dto/webhook-file-processed.dto';
import { FileStatus } from '../entities/file.entity';
import { FileController, WebhookController } from '../file.controller';
import type { FileEvent } from '../file.service';
import { FileService } from '../file.service';

const DEFAULT_EVENT_ID = 'sandbox';

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;

  const fileEvents$ = new Subject<FileEvent>();
  const mockFileService = {
    createFile: jest.fn(),
    listFilesByEvent: jest.fn(),
    getFileById: jest.fn(),
    getFileEventsStream: jest.fn(),
    deleteFile: jest.fn(),
    renameFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
    mockFileService.getFileEventsStream.mockReturnValue(fileEvents$);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should return fileId and status for valid upload', async () => {
      const req = { user: { userId: 7 } };
      const file = {
        originalname: 'deck.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      mockFileService.createFile.mockResolvedValue({
        fileId: 42,
        status: FileStatus.PROCESSING,
      });

      const result = await controller.uploadFile(req, DEFAULT_EVENT_ID, file);

      expect(fileService.createFile).toHaveBeenCalledWith(7, DEFAULT_EVENT_ID, file);
      expect(result).toEqual({
        fileId: 42,
        status: FileStatus.PROCESSING,
      });
    });

    it('should throw when file is missing', async () => {
      const req = { user: { userId: 7 } };

      await expect(
        controller.uploadFile(req, DEFAULT_EVENT_ID, undefined as unknown as Express.Multer.File),
      ).rejects.toThrow('No file provided');
    });

    it('should throw for unsupported mime type', async () => {
      const req = { user: { userId: 7 } };
      const file = {
        originalname: 'archive.zip',
        mimetype: 'application/zip',
        size: 1024,
      } as Express.Multer.File;

      await expect(controller.uploadFile(req, DEFAULT_EVENT_ID, file)).rejects.toThrow(
        'Invalid file type. Only images, videos, and PDFs are allowed.',
      );
    });

    it('should throw when file exceeds max size', async () => {
      const req = { user: { userId: 7 } };
      const file = {
        originalname: 'big.pdf',
        mimetype: 'application/pdf',
        size: 201 * 1024 * 1024,
      } as Express.Multer.File;

      await expect(controller.uploadFile(req, DEFAULT_EVENT_ID, file)).rejects.toThrow(
        'File size exceeds maximum limit of 200MB',
      );
    });
  });

  describe('getFile', () => {
    it('should return mapped file response', async () => {
      const req = { user: { userId: 9 } };
      const fileEntity = {
        id: 3,
        status: FileStatus.READY,
        filename: 'deck.pdf',
        mimeType: 'application/pdf',
        size: 2048,
        blobUrl: 'https://storage/files/blob.pdf',
        blobPath: 'dev/key/pdfs/source.pdf',
        storageKey: 'storage-key-1',
        pageCount: 8,
        thumbnailUrl: 'https://storage/files/001.webp',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-02'),
      };
      mockFileService.getFileById.mockResolvedValue(fileEntity);

      const result = await controller.getFile(req, DEFAULT_EVENT_ID, 3);

      expect(fileService.getFileById).toHaveBeenCalledWith(3, 9, DEFAULT_EVENT_ID);
      expect(result.fileId).toBe(3);
      expect(result.status).toBe(FileStatus.READY);
      expect(result.storageKey).toBe('storage-key-1');
      expect(result.eventID).toBe(DEFAULT_EVENT_ID);
    });

    it('should propagate not found errors', async () => {
      const req = { user: { userId: 9 } };
      mockFileService.getFileById.mockRejectedValue(new NotFoundException('File not found'));

      await expect(controller.getFile(req, DEFAULT_EVENT_ID, 77)).rejects.toThrow(
        NotFoundException,
      );
      expect(fileService.getFileById).toHaveBeenCalledWith(77, 9, DEFAULT_EVENT_ID);
    });
  });

  describe('deleteFile', () => {
    it('should call service with correct args', async () => {
      const req = { user: { userId: 5 } };
      mockFileService.deleteFile.mockResolvedValue(undefined);

      await controller.deleteFile(req, DEFAULT_EVENT_ID, 10);

      expect(fileService.deleteFile).toHaveBeenCalledWith(10, 5, DEFAULT_EVENT_ID);
    });

    it('should propagate not found errors', async () => {
      const req = { user: { userId: 5 } };
      mockFileService.deleteFile.mockRejectedValue(new NotFoundException('File not found'));

      await expect(controller.deleteFile(req, DEFAULT_EVENT_ID, 99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('renameFile', () => {
    it('should return mapped file response with updated filename', async () => {
      const req = { user: { userId: 6 } };
      const updatedEntity = {
        id: 7,
        status: FileStatus.READY,
        filename: 'keynote-final.pdf',
        mimeType: 'application/pdf',
        size: 4096,
        blobUrl: 'https://storage/files/blob.pdf',
        blobPath: 'dev/key/pdfs/source.pdf',
        storageKey: 'sk-abc',
        pageCount: 12,
        thumbnailUrl: 'https://storage/files/001.webp',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-04-18'),
      };
      mockFileService.renameFile.mockResolvedValue(updatedEntity);

      const result = await controller.renameFile(req, DEFAULT_EVENT_ID, 7, {
        filename: 'keynote-final.pdf',
      });

      expect(fileService.renameFile).toHaveBeenCalledWith(
        7,
        6,
        DEFAULT_EVENT_ID,
        'keynote-final.pdf',
      );
      expect(result.fileId).toBe(7);
      expect(result.filename).toBe('keynote-final.pdf');
      expect(result.eventID).toBe(DEFAULT_EVENT_ID);
      expect(result.updatedAt).toEqual(updatedEntity.updatedAt);
    });

    it('should propagate not found errors', async () => {
      const req = { user: { userId: 6 } };
      mockFileService.renameFile.mockRejectedValue(new NotFoundException('File not found'));

      await expect(
        controller.renameFile(req, DEFAULT_EVENT_ID, 99, { filename: 'new.pdf' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sse', () => {
    it('should map service events to SSE payload', async () => {
      const req = { user: { userId: 12 } };
      const result$ = controller.sse(req, DEFAULT_EVENT_ID);

      const eventPromise = firstValueFrom(result$);
      fileEvents$.next({ status: FileStatus.PROCESSING, eventId: 1, eventID: DEFAULT_EVENT_ID });

      const event = await eventPromise;
      expect(fileService.getFileEventsStream).toHaveBeenCalledWith(12);
      expect(event.type).toBe('FILE_UPLOADED');
      expect(event.data).toBe(
        JSON.stringify({
          status: FileStatus.PROCESSING,
          eventId: 1,
          eventID: DEFAULT_EVENT_ID,
        }),
      );
    });
  });
});

describe('WebhookController', () => {
  let controller: WebhookController;
  let fileService: FileService;

  const mockFileService = {
    updateFileStatus: jest.fn(),
  };

  const mockAzureConfig = {
    webhookSecret: 'test-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: AzureConfig,
          useValue: mockAzureConfig,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    fileService = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleFileProcessed', () => {
    it('should update file status when secret is valid', async () => {
      const dto: WebhookFileProcessedDto = {
        fileId: 12,
        userId: 4,
        status: FileStatus.READY,
        pageCount: 5,
        thumbnailUrl: 'https://storage/files/001.webp',
        blobUrl: 'https://storage/files/source.pdf',
        blobPath: 'dev/abc/pdfs/source.pdf',
      };
      mockFileService.updateFileStatus.mockResolvedValue(undefined);

      const result = await controller.handleFileProcessed('test-secret', dto);

      expect(fileService.updateFileStatus).toHaveBeenCalledWith(
        12,
        4,
        FileStatus.READY,
        5,
        'https://storage/files/001.webp',
        undefined,
        'https://storage/files/source.pdf',
        'dev/abc/pdfs/source.pdf',
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw unauthorized for invalid secret', async () => {
      const dto: WebhookFileProcessedDto = {
        fileId: 12,
        userId: 4,
        status: FileStatus.FAILED,
      };

      await expect(controller.handleFileProcessed('wrong-secret', dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(fileService.updateFileStatus).not.toHaveBeenCalled();
    });
  });
});
