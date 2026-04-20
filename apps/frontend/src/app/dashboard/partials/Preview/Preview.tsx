'use client';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { Button, Icon } from '@/ui';

import { ImageViewer } from './partials/ImageViewer';
import { NoPreview } from './partials/NoPreview';
import { SlideViewer } from './partials/SlideViewer';
import { VideoViewer } from './partials/VideoViewer';
import { Container, Toolbar, ToolbarActions, ToolbarTitle } from './styled';

function getViewerType(file: FileResponse): 'image' | 'video' | 'slide' {
  const mime = file.mimeType ?? '';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'slide';
}

export const Preview = () => {
  const { selectedFile } = usePreviewStore();

  return (
    <Container>
      {selectedFile && (
        <Toolbar>
          <ToolbarTitle>{selectedFile?.filename ?? ''}</ToolbarTitle>
          <ToolbarActions>
            <Button variant='ghost' disabled={!selectedFile}>
              <Icon name='add' size={18} />
            </Button>
            <Button variant='ghost' disabled={!selectedFile}>
              <Icon name='folder-open-outline' size={18} />
            </Button>
            <Button variant='ghost' disabled={!selectedFile}>
              <Icon name='trash-outline' size={18} />
            </Button>
          </ToolbarActions>
        </Toolbar>
      )}
      {!selectedFile ? (
        <NoPreview />
      ) : getViewerType(selectedFile) === 'image' ? (
        <ImageViewer file={selectedFile} />
      ) : getViewerType(selectedFile) === 'video' ? (
        <VideoViewer file={selectedFile} />
      ) : (
        <SlideViewer file={selectedFile} />
      )}
    </Container>
  );
};
