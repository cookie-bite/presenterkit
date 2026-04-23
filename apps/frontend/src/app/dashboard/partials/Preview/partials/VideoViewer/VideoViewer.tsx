import { FileResponse } from '@/lib/api/file.api';

import { Stage } from '../../styled';
import { Video } from './styled';

interface VideoViewerProps {
  file: FileResponse;
}

export const VideoViewer = ({ file }: VideoViewerProps) => (
  <Stage>
    <Video controls autoPlay playsInline src={file.blobUrl ?? ''} />
  </Stage>
);
