'use client';

import { useState } from 'react';

import { useFileStatus } from '@/lib/hooks/useFileStatus';
import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { useFileUploadMutation } from '@/lib/hooks/useFileUploadMutation';
import { Icon, Shortcut } from '@/ui';

import { Command, Commands, Container, UploadArea } from './styled';

export const NoFiles = () => {
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const uploadMutation = useFileUploadMutation();
  const fileStatus = useFileStatus({
    fileId: uploadedFileId,
    enabled: uploadedFileId !== null,
  });

  const handleFileSelect = async (files: File[]) => {
    // Upload the first file (multiple uploads can be added later)
    if (files.length > 0) {
      try {
        const result = await uploadMutation.mutateAsync(files[0]);
        console.log('result', result);
        if ('fileId' in result) {
          setUploadedFileId(result.fileId);
        } else {
          console.error('Upload failed:', result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleError = (error: string) => {
    console.error('File selection error:', error);
  };

  const { getRootProps, FileInput, isDragActive } = useFileUpload({
    onFileSelect: handleFileSelect,
    onError: handleError,
    multiple: false, // Single file upload for now
  });

  // Determine current status message
  const getStatusMessage = () => {
    if (uploadMutation.isPending) {
      return 'Uploading...';
    }
    if (fileStatus.isLoading && uploadedFileId) {
      return 'Processing...';
    }
    if (fileStatus.status === 'processing') {
      return 'Processing file...';
    }
    if (fileStatus.status === 'ready') {
      return 'File ready!';
    }
    if (fileStatus.status === 'failed') {
      return 'Processing failed';
    }
    if (uploadMutation.error) {
      return 'Upload failed';
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <Container {...getRootProps()}>
      {FileInput}
      {!isDragActive && (
        <>
          <Icon name='folder-open' size={100} color='text.tertiary' />
          <Commands>
            <Command type='button'>
              {uploadMutation.isPending || fileStatus.isLoading ? statusMessage : 'Upload File'}
              <Shortcut keys={['shift', 'command', 'U']} />
            </Command>
          </Commands>
          {statusMessage && (
            <div style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
              {statusMessage}
            </div>
          )}
        </>
      )}
      {isDragActive && <UploadArea>Drop files anywhere</UploadArea>}
    </Container>
  );
};
