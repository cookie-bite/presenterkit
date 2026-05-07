'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { AnalyticsEvents, capturePosthogException, trackEvent } from '@/lib/analytics';

import { useFileStatus } from './useFileStatus';
import { useFileUpload } from './useFileUpload';
import { useFileUploadMutation } from './useFileUploadMutation';

export function useFileUploadHandler() {
  const queryClient = useQueryClient();
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  const uploadMutation = useFileUploadMutation();
  const fileStatus = useFileStatus({
    fileId: uploadedFileId,
    enabled: uploadedFileId !== null,
  });

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      pendingFileRef.current = files[0];
      const result = await uploadMutation.mutateAsync(files[0]);
      if ('fileId' in result) {
        setUploadedFileId(result.fileId);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      capturePosthogException(error);
      console.error('Upload error:', error);
    }
  };

  useEffect(() => {
    if (fileStatus.status === 'ready') {
      trackEvent(AnalyticsEvents.fileUploaded, {
        file_name: pendingFileRef.current?.name,
        file_type: pendingFileRef.current?.type,
        file_size: pendingFileRef.current?.size,
      });
      void queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  }, [fileStatus.status, queryClient]);

  const { getRootProps, FileInput, isDragActive, open } = useFileUpload({
    onFileSelect: handleFileSelect,
    onError: error => console.error('File selection error:', error),
    multiple: false,
  });

  const statusMessage = (() => {
    if (uploadMutation.isPending) return 'Uploading...';
    if (fileStatus.isLoading && uploadedFileId) return 'Processing...';
    if (fileStatus.status === 'processing') return 'Processing file...';
    if (fileStatus.status === 'ready') return 'File ready!';
    if (fileStatus.status === 'failed') return 'Processing failed';
    if (uploadMutation.error) return 'Upload failed';
    return null;
  })();

  const isUploadActive =
    uploadMutation.isPending ||
    (uploadedFileId !== null && (fileStatus.isLoading || fileStatus.status === 'processing'));

  return {
    getRootProps,
    FileInput,
    isDragActive,
    openFilePicker: open,
    statusMessage,
    isPending: uploadMutation.isPending,
    isLoading: fileStatus.isLoading,
    isUploadActive,
  };
}
