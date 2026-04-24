import { useFileDeleteHandler } from '@/lib/hooks/useFileDeleteHandler';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { Button, Icon } from '@/ui';

import { ToolbarActions, ToolbarContainer, ToolbarTitle } from './styled';

export const Toolbar = () => {
  const { selectedFile } = usePreviewStore();
  const { handleDelete, isDeleting } = useFileDeleteHandler();

  if (!selectedFile) return null;

  return (
    <ToolbarContainer>
      <ToolbarTitle>{selectedFile.filename ?? ''}</ToolbarTitle>
      <ToolbarActions>
        <Button
          variant='ghost'
          onClick={() => void handleDelete(selectedFile.fileId)}
          isPending={isDeleting}
        >
          <Icon name='trash-outline' size={18} />
        </Button>
      </ToolbarActions>
    </ToolbarContainer>
  );
};
