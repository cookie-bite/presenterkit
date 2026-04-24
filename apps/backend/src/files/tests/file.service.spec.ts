import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AzureConfig } from '../../config/azure.config';
import { EventsService } from '../../events/events.service';
import { File, FileStatus } from '../entities/file.entity';
import { FileService } from '../file.service';
import { FileProcessingService } from '../file-processing.service';

describe('FileService', () => {
  let service: FileService;

  const mockFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };
  const mockFileProcessingService = {
    start: jest.fn(),
  };
  const mockEventsService = {
    findByEventID: jest.fn(),
  };
  const mockAzureConfig = {
    storageConnectionString: 'UseDevelopmentStorage=true',
    containerName: 'test',
    blobPathPrefix: 'dev',
  } as AzureConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: getRepositoryToken(File), useValue: mockFileRepository },
        { provide: FileProcessingService, useValue: mockFileProcessingService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: AzureConfig, useValue: mockAzureConfig },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('createFile', () => {
    it('should create file and return id/status', async () => {
      mockEventsService.findByEventID.mockResolvedValue({ id: 11, eventID: 'sandbox' });
      mockFileRepository.create.mockReturnValue({
        userId: 4,
        eventId: 11,
        filename: 'deck.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        status: FileStatus.PROCESSING,
        blobPath: '',
        storageKey: 'sk',
      });
      mockFileRepository.save.mockResolvedValue({ id: 88, status: FileStatus.PROCESSING });
      mockFileProcessingService.start.mockResolvedValue({ type: 'queued' });

      const result = await service.createFile(4, 'sandbox', {
        originalname: 'deck.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File);

      expect(result).toEqual({ fileId: 88, status: FileStatus.PROCESSING });
      expect(mockEventsService.findByEventID).toHaveBeenCalledWith(4, 'sandbox');
    });
  });

  describe('getFileById', () => {
    it('should throw when file does not exist', async () => {
      mockEventsService.findByEventID.mockResolvedValue({ id: 11 });
      mockFileRepository.findOne.mockResolvedValue(null);

      await expect(service.getFileById(1, 4, 'sandbox')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFileStatus', () => {
    it('should update and save existing file', async () => {
      const file = {
        id: 5,
        eventId: 11,
        userId: 4,
        status: FileStatus.PROCESSING,
      } as File;
      mockFileRepository.findOne.mockResolvedValue(file);
      mockFileRepository.save.mockResolvedValue(file);

      await service.updateFileStatus(
        5,
        4,
        FileStatus.READY,
        10,
        'thumb.webp',
        undefined,
        'blob',
        'p',
      );

      expect(mockFileRepository.save).toHaveBeenCalled();
    });
  });
});
