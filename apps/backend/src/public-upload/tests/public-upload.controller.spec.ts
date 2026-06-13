import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { FileStatus } from '../../files/entities/file.entity';
import { FileService } from '../../files/file.service';
import { PublicUploadController } from '../public-upload.controller';
import { UploadTokenGuard } from '../upload-token.guard';

describe('PublicUploadController', () => {
  let controller: PublicUploadController;
  let fileService: FileService;

  const mockFileService = {
    createFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicUploadController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    })
      .overrideGuard(UploadTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PublicUploadController>(PublicUploadController);
    fileService = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUploadPage', () => {
    it('should return event name from upload event', () => {
      const req = {
        uploadEvent: {
          name: 'Sandbox',
          userId: 1,
          eventID: 'sandbox',
        },
      };

      const result = controller.getUploadPage(req);

      expect(result).toEqual({ eventName: 'Sandbox' });
    });
  });

  describe('uploadViaLink', () => {
    it('should upload file for upload event owner', async () => {
      const req = {
        uploadEvent: {
          name: 'Sandbox',
          userId: 7,
          eventID: 'sandbox',
        },
      };
      const file = {
        originalname: 'deck.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      mockFileService.createFile.mockResolvedValue({
        fileId: 42,
        status: FileStatus.PROCESSING,
      });

      const result = await controller.uploadViaLink(req, file, 'Guest');

      expect(fileService.createFile).toHaveBeenCalledWith(7, 'sandbox', file, 'Guest');
      expect(result).toEqual({
        fileId: 42,
        status: FileStatus.PROCESSING,
      });
    });

    it('should default uploadedBy to Guest when empty', async () => {
      const req = {
        uploadEvent: {
          name: 'Sandbox',
          userId: 7,
          eventID: 'sandbox',
        },
      };
      const file = {
        originalname: 'deck.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      mockFileService.createFile.mockResolvedValue({
        fileId: 42,
        status: FileStatus.PROCESSING,
      });

      await controller.uploadViaLink(req, file, '   ');

      expect(fileService.createFile).toHaveBeenCalledWith(7, 'sandbox', file, 'Guest');
    });

    it('should throw when file is missing', async () => {
      const req = {
        uploadEvent: {
          name: 'Sandbox',
          userId: 7,
          eventID: 'sandbox',
        },
      };

      await expect(
        controller.uploadViaLink(req, undefined as unknown as Express.Multer.File, 'Guest'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for unsupported mime type', async () => {
      const req = {
        uploadEvent: {
          name: 'Sandbox',
          userId: 7,
          eventID: 'sandbox',
        },
      };
      const file = {
        originalname: 'notes.txt',
        mimetype: 'text/plain',
        size: 100,
      } as Express.Multer.File;

      await expect(controller.uploadViaLink(req, file, 'Guest')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
