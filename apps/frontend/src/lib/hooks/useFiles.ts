'use client';

import { useQuery } from '@tanstack/react-query';

import { type FileResponse, listFiles } from '@/lib/api/file.api';

export function useFiles() {
  const {
    data: files = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<FileResponse[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const result = await listFiles();
      console.log('[useFiles] listFiles result', result);
      if (!result || 'error' in result) return [];
      return result as FileResponse[];
    },
  });

  return {
    files,
    hasFiles: files.length > 0,
    isLoading,
    isError,
    refetch,
  };
}
