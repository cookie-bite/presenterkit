import { apiClient } from './client';

export interface UploadPageResponse {
  eventName: string;
}

export interface UploadLinkResponse {
  token: string;
}

export interface UploadViaLinkResponse {
  fileId: number;
  status: string;
}

export async function createLink(eventID: string): Promise<UploadLinkResponse> {
  return apiClient.post(`events/${eventID}/upload-link`).json<UploadLinkResponse>();
}

export async function getUploadPage(token: string): Promise<UploadPageResponse> {
  return apiClient.get('upload', { searchParams: { token } }).json<UploadPageResponse>();
}

export async function uploadViaLink(
  token: string,
  file: File,
  uploadedBy: string,
): Promise<UploadViaLinkResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', uploadedBy);

  return apiClient
    .post('upload', {
      searchParams: { token },
      body: formData,
      headers: {
        'Content-Type': undefined,
      },
    })
    .json<UploadViaLinkResponse>();
}
