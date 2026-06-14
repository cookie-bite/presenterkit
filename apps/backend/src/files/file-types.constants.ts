export const OFFICE_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
]);

export const PDF_MIME_TYPE = 'application/pdf';

export const AUDIO_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/vnd.wave',
  'audio/aac',
  'audio/x-aac',
  'audio/mp4',
  'audio/x-m4a',
]);

export const isImageMimeType = (mimeType: string): boolean => mimeType.startsWith('image/');
export const isVideoMimeType = (mimeType: string): boolean => mimeType.startsWith('video/');
export const isOfficeMimeType = (mimeType: string): boolean => OFFICE_MIME_TYPES.has(mimeType);
export const isPdfMimeType = (mimeType: string): boolean => mimeType === PDF_MIME_TYPE;
export const isAudioMimeType = (mimeType: string): boolean => AUDIO_MIME_TYPES.has(mimeType);

export const isAllowedMimeType = (mimeType: string): boolean =>
  isImageMimeType(mimeType) ||
  isVideoMimeType(mimeType) ||
  isPdfMimeType(mimeType) ||
  isOfficeMimeType(mimeType) ||
  isAudioMimeType(mimeType);
