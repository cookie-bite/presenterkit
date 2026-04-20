import { FileResponse } from '@/lib/api/file.api';

import { MainPageArea } from '../../styled';
import { Video } from './styled';

interface VideoViewerProps {
  file: FileResponse;
}

export const VideoViewer = ({ file }: VideoViewerProps) => (
  <MainPageArea>
    <Video controls src={file.blobUrl ?? ''} />
  </MainPageArea>
);
