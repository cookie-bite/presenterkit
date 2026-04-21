'use client';

import { useMutation } from '@tanstack/react-query';

import { deleteFile } from '@/lib/api/file.api';

/**
 * Hook for deleting files using React Query
 */
export function useFileDeleteMutation() {
  return useMutation<void, Error, number>({
    mutationFn: deleteFile,
  });
}
