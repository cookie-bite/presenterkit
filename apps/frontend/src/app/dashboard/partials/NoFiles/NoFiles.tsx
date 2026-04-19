'use client';

import { useFileUploadHandler } from '@/lib/hooks/useFileUploadHandler';
import { Icon, Shortcut } from '@/ui';

import { Command, Commands, Container, UploadArea } from './styled';

export const NoFiles = () => {
  const { getRootProps, FileInput, isDragActive, statusMessage, isPending, isLoading } =
    useFileUploadHandler();

  return (
    <Container {...getRootProps()}>
      {FileInput}
      {!isDragActive && (
        <>
          <Icon name='folder-open' size={100} color='text.tertiary' />
          <Commands>
            <Command type='button'>
              {isPending || isLoading ? statusMessage : 'Upload File'}
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
