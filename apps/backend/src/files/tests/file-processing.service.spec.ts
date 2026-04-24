import { BlobServiceClient } from '@azure/storage-blob';

import { AzureConfig } from '../../config/azure.config';
import { FileProcessingService } from '../file-processing.service';

describe('FileProcessingService', () => {
  const originalFetch = global.fetch;
  const mockSourceBlobClient = {
    uploadData: jest.fn(),
    url: 'https://blob/source.png',
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

  it('should upload directly for image files', async () => {
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
      blobUrl: 'https://blob/source.png',
      blobPath: 'dev/sk/image/source.png',
      thumbnailUrl: 'https://blob/source.png',
    });
    expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith('dev/sk/image/source.png');
    expect(mockSourceBlobClient.uploadData).toHaveBeenCalled();
  });

  it('should queue conversion for pdf files', async () => {
    const service = new FileProcessingService(mockAzureConfig);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    } as Response);

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
