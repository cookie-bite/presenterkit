'use client';

import { useQueryClient } from '@tanstack/react-query';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';

import { useFileDeleteMutation } from './useFileDeleteMutation';

export function useFileDeleteHandler() {
  const queryClient = useQueryClient();
  const { setSelectedFile } = usePreviewStore();
  const deleteMutation = useFileDeleteMutation();

  const handleDelete = async (fileId: number) => {
    const previousFiles = queryClient.getQueryData<FileResponse[]>(['files']) ?? [];
    const deletedIndex = previousFiles.findIndex(file => file.fileId === fileId);
    const nextFiles = previousFiles.filter(file => file.fileId !== fileId);
    const nextSelectedFile =
      nextFiles.length > 0 && deletedIndex >= 0
        ? nextFiles[Math.min(deletedIndex, nextFiles.length - 1)]
        : null;

    queryClient.setQueryData<FileResponse[]>(['files'], nextFiles);
    setSelectedFile(nextSelectedFile);

    try {
      await deleteMutation.mutateAsync(fileId);
    } catch (error) {
      queryClient.setQueryData<FileResponse[]>(['files'], previousFiles);
      setSelectedFile(deletedIndex >= 0 ? previousFiles[deletedIndex] : null);
      console.error('Delete error:', error);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
