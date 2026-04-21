'use client';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';

import { ImageViewer } from './partials/ImageViewer';
import { NoPreview } from './partials/NoPreview';
import { SlideViewer } from './partials/SlideViewer';
import { Toolbar } from './partials/Toolbar/Toolbar';
import { VideoViewer } from './partials/VideoViewer';
import { Container } from './styled';

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
      <Toolbar />
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
