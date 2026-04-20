export const OFFICE_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
]);

export const PDF_MIME_TYPE = 'application/pdf';

export const isImageMimeType = (mimeType: string): boolean => mimeType.startsWith('image/');
export const isVideoMimeType = (mimeType: string): boolean => mimeType.startsWith('video/');
export const isOfficeMimeType = (mimeType: string): boolean => OFFICE_MIME_TYPES.has(mimeType);
export const isPdfMimeType = (mimeType: string): boolean => mimeType === PDF_MIME_TYPE;

export const isAllowedMimeType = (mimeType: string): boolean =>
  isImageMimeType(mimeType) ||
  isVideoMimeType(mimeType) ||
  isPdfMimeType(mimeType) ||
  isOfficeMimeType(mimeType);
