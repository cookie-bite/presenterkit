import { apiClient } from './client';
import type { ErrorResponse } from './types';

export interface UploadFileResponse {
  fileId: number;
  status: string;
}

export interface FileResponse {
  fileId: number;
  status: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  blobUrl?: string;
  blobPath?: string;
  storageKey?: string | null;
  pageCount?: number | null;
  thumbnailUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Upload a file
 */
export async function uploadFile(file: File): Promise<UploadFileResponse | ErrorResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient
    .post('files', {
      body: formData,
      headers: {
        // Override default Content-Type - ky will auto-detect FormData
        'Content-Type': undefined,
      },
    })
    .json<UploadFileResponse | ErrorResponse>();
}

/**
 * Get file details by ID
 */
export async function getFile(fileId: number): Promise<FileResponse | ErrorResponse> {
  return apiClient.get(`files/${fileId}`).json<FileResponse | ErrorResponse>();
}
