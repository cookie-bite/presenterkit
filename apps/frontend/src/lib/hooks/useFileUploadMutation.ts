'use client';

import { useMutation } from '@tanstack/react-query';

import { uploadFile, type UploadFileResponse } from '@/lib/api/file.api';
import type { ErrorResponse } from '@/lib/api/types';

/**
 * Hook for uploading files using React Query
 */
export function useFileUploadMutation() {
  return useMutation<UploadFileResponse | ErrorResponse, Error, File>({
    mutationFn: uploadFile,
  });
}
