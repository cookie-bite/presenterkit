'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { type FileResponse, getFile } from '@/lib/api/file.api';
import type { ErrorResponse } from '@/lib/api/types';
import { type FileEvent, useFileSSE } from '@/lib/sse/file-sse';

export interface UseFileStatusOptions {
  fileId: number | null;
  enabled?: boolean;
}

export interface FileStatusResult {
  status: string | null;
  isLoading: boolean;
  error: Error | null;
  file: FileResponse | null;
}

/**
 * Hook that combines React Query for initial file status
 * and SSE for real-time updates
 */
export function useFileStatus(options: UseFileStatusOptions): FileStatusResult {
  const { fileId, enabled = true } = options;
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  // Query file status from API
  const {
    data: fileData,
    isLoading,
    error: queryError,
  } = useQuery<FileResponse | ErrorResponse, Error>({
    queryKey: ['file', fileId],
    queryFn: () => {
      if (!fileId) throw new Error('File ID is required');
      return getFile(fileId);
    },
    enabled: enabled && fileId !== null,
    refetchInterval: false, // Don't poll, rely on SSE
  });

  // Handle SSE events for real-time updates
  const handleFileEvent = (event: FileEvent) => {
    setCurrentStatus(event.status);
  };

  // Only connect to SSE if we have a fileId to track
  const { error: sseError } = useFileSSE(
    handleFileEvent, // FILE_UPLOADED
    handleFileEvent, // FILE_READY
    handleFileEvent, // FILE_FAILED
  );

  // Only show SSE error if we're actually tracking a file
  const shouldShowSSEError = enabled && fileId !== null && sseError;

  // Determine current status (SSE takes precedence if available)
  const status = currentStatus || (fileData && 'fileId' in fileData ? fileData.status : null);

  // Extract file data if successful
  const file = fileData && 'fileId' in fileData ? fileData : null;

  // Handle error (only show SSE error if we're tracking a file)
  const error =
    queryError ||
    (fileData && 'error' in fileData ? new Error((fileData as ErrorResponse).error) : null) ||
    (shouldShowSSEError ? sseError : null);

  return {
    status,
    isLoading,
    error,
    file,
  };
}
