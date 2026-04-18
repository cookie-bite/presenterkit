import { DEFAULT_EVENT_ID } from '../constants';
import { apiClient } from './client';
import type { ErrorResponse } from './types';

export interface UploadFileResponse {
  fileId: number;
  status: string;
}

export interface FileResponse {
  fileId: number;
  status: string;
  eventID?: string;
  filename?: string;
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
 * Upload a file to the default event
 */
export async function uploadFile(file: File): Promise<UploadFileResponse | ErrorResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient
    .post(`events/${DEFAULT_EVENT_ID}/files`, {
      body: formData,
      headers: {
        'Content-Type': undefined,
      },
    })
    .json<UploadFileResponse | ErrorResponse>();
}

/**
 * List files for the default event
 */
export async function listFiles(): Promise<FileResponse[] | ErrorResponse> {
  return apiClient.get(`events/${DEFAULT_EVENT_ID}/files`).json<FileResponse[] | ErrorResponse>();
}

/**
 * Get file details by ID within the default event
 */
export async function getFile(fileId: number): Promise<FileResponse | ErrorResponse> {
  return apiClient
    .get(`events/${DEFAULT_EVENT_ID}/files/${fileId}`)
    .json<FileResponse | ErrorResponse>();
}

/**
 * Rename a file within the default event
 */
export async function renameFile(
  fileId: number,
  filename: string,
): Promise<FileResponse | ErrorResponse> {
  return apiClient
    .patch(`events/${DEFAULT_EVENT_ID}/files/${fileId}`, { json: { filename } })
    .json<FileResponse | ErrorResponse>();
}

/**
 * Delete a file within the default event
 */
export async function deleteFile(fileId: number): Promise<void> {
  await apiClient.delete(`events/${DEFAULT_EVENT_ID}/files/${fileId}`);
}
