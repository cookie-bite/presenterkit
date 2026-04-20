import { FileResponse } from '@/lib/api/file.api';
import { useFileUploadHandler } from '@/lib/hooks/useFileUploadHandler';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { Button, Icon, Panel, ScrollView } from '@/ui';

import { File, FileHoverOverlay, Thumbnail, Title, UploadCard } from './styled';

export const Files = ({ files }: { files: FileResponse[] }) => {
  const { FileInput, openFilePicker, isUploadActive, statusMessage } = useFileUploadHandler();
  const { selectedFile, setSelectedFile } = usePreviewStore();

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
      <ScrollView $gap='6px' $padding='6px'>
        {isUploadActive && (
          <File>
            <UploadCard>{statusMessage}</UploadCard>
          </File>
        )}
        {files.map(file => (
          <File
            key={file.fileId}
            onClick={() => setSelectedFile(file)}
            $isSelected={selectedFile?.fileId === file.fileId}
          >
            <FileHoverOverlay $isSelected={selectedFile?.fileId === file.fileId} />
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
