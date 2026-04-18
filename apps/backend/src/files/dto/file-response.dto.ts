import { FileStatus } from '../entities/file.entity';

export class FileResponseDto {
  fileId: number;
  status: FileStatus;
  eventID?: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  blobUrl?: string;
  blobPath?: string;
  storageKey?: string | null;
  pageCount?: number | null;
  thumbnailUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
