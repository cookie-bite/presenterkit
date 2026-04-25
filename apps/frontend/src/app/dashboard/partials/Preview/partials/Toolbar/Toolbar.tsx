import { useFileDeleteHandler } from '@/lib/hooks/useFileDeleteHandler';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { Button, Icon } from '@/ui';

import { Actions, Container, Left, Title } from './styled';

export const Toolbar = () => {
  const { selectedFile, setSelectedFile } = usePreviewStore();
  const { handleDelete, isDeleting } = useFileDeleteHandler();

  if (!selectedFile) return null;

  return (
    <Container>
      <Left>
        <Button variant='ghost' onClick={() => setSelectedFile(null)}>
          <Icon name='close' size={18} />
        </Button>
        <Title>{selectedFile.filename ?? ''}</Title>
      </Left>
      <Actions>
        <Button
          variant='ghost'
          onClick={() => void handleDelete(selectedFile.fileId)}
          isPending={isDeleting}
        >
          <Icon name='trash-outline' size={18} />
        </Button>
      </Actions>
    </Container>
  );
};
