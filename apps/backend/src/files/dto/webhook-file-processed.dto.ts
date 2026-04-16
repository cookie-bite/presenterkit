import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { FileStatus } from '../entities/file.entity';

export class WebhookFileProcessedDto {
  @IsInt()
  fileId: number;

  @IsInt()
  userId: number;

  @IsEnum(FileStatus)
  status: FileStatus;

  @IsOptional()
  @IsInt()
  pageCount?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsString()
  blobUrl?: string;

  @IsOptional()
  @IsString()
  blobPath?: string;
}
