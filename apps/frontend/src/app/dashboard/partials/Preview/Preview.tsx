'use client';

import { FileResponse } from '@/lib/api/file.api';
import { useFiles } from '@/lib/hooks/useFiles';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';

import { ImageViewer } from './partials/ImageViewer';
import { NoPreview } from './partials/NoPreview';
import { SlideViewer } from './partials/SlideViewer';
import { TimelineViewer } from './partials/TimelineViewer';
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
  const { files } = useFiles();
  const { clips, selectedInstanceId } = useTimelineStore();
  const hasSelectedClip = selectedInstanceId
    ? clips.some(clip => clip.instanceId === selectedInstanceId)
    : false;

  return (
    <Container>
      <Toolbar />
      {!selectedFile ? (
        <NoPreview />
      ) : hasSelectedClip && selectedInstanceId ? (
        <TimelineViewer
          key={selectedInstanceId}
          clips={clips}
          files={files}
          selectedInstanceId={selectedInstanceId}
        />
      ) : getViewerType(selectedFile) === 'image' ? (
        <ImageViewer file={selectedFile} />
      ) : getViewerType(selectedFile) === 'video' ? (
        <VideoViewer file={selectedFile} />
      ) : (
        <SlideViewer key={selectedFile.fileId} file={selectedFile} />
      )}
    </Container>
  );
};
