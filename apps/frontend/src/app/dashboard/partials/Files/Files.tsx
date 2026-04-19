import { FileResponse } from '@/lib/api/file.api';
import { useFileUploadHandler } from '@/lib/hooks/useFileUploadHandler';
import { Button, Icon, Panel, ScrollView } from '@/ui';

import { File, Thumbnail, Title, UploadCard } from './styled';

export const Files = ({ files }: { files: FileResponse[] }) => {
  const { FileInput, openFilePicker, isUploadActive, statusMessage } = useFileUploadHandler();

  return (
    <Panel
      title='Files'
      actions={
        <Button variant='ghost' onClick={openFilePicker}>
          <Icon name='add' />
        </Button>
      }
    >
      {FileInput}
      <ScrollView $gap='12px' $padding='8px 0'>
        {isUploadActive && (
          <File>
            <UploadCard>{statusMessage}</UploadCard>
          </File>
        )}
        {files.map(file => (
          <File key={file.fileId}>
            <Title>{file.filename}</Title>
            <Thumbnail
              src={file.thumbnailUrl ?? ''}
              alt={file.filename ?? ''}
              width={500}
              height={500}
            />
          </File>
        ))}
      </ScrollView>
    </Panel>
  );
};
