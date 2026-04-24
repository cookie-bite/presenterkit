import { FileResponse } from '@/lib/api/file.api';
import { useFileUploadHandler } from '@/lib/hooks/useFileUploadHandler';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { Button, Icon, Panel, ScrollView } from '@/ui';

import { EmptyHint } from '../../styled';
import { FileCard } from './partials/FileCard';
import { File } from './partials/FileCard/styled';
import { Container, UploadCard } from './styled';

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
      <Container>
        {FileInput}
        {!isUploadActive && files.length === 0 ? (
          <EmptyHint>Step 1: Upload your assets - image, video, PDF, or PPTX.</EmptyHint>
        ) : (
          <ScrollView $gap='6px' $padding='6px'>
            {isUploadActive && (
              <File>
                <UploadCard>{statusMessage}</UploadCard>
              </File>
            )}
            {files.map(file => (
              <FileCard
                key={file.fileId}
                file={file}
                isSelected={selectedFile?.fileId === file.fileId}
                onClick={() => setSelectedFile(file)}
              />
            ))}
          </ScrollView>
        )}
      </Container>
    </Panel>
  );
};
