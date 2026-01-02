'use client';

import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { Icon, Shortcut } from '@/ui';

import { Command, Commands, Container, UploadArea } from './styled';

export const NoFiles = () => {
  const handleFileSelect = (files: File[]) => {
    // Handle the selected files
    console.log(
      'Files selected:',
      files.map(file => file.name),
    );
    // TODO: Implement file upload logic
  };

  const handleError = (error: string) => {
    // Handle upload errors
    console.error('Upload error:', error);
    // TODO: Show error notification to user
  };

  const { getRootProps, FileInput, isDragActive } = useFileUpload({
    onFileSelect: handleFileSelect,
    onError: handleError,
    multiple: true,
  });

  return (
    <Container {...getRootProps()}>
      {FileInput}
      {!isDragActive && (
        <>
          <Icon name='folder-open' size={100} color='text.tertiary' />
          <Commands>
            <Command type='button'>
              Upload File
              <Shortcut keys={['shift', 'command', 'U']} />
            </Command>
          </Commands>
        </>
      )}
      {isDragActive && <UploadArea>Drop files anywhere</UploadArea>}
    </Container>
  );
};
