import { FileResponse } from '@/lib/api/file.api';

import { MainPageArea } from '../../styled';
import { Image } from './styled';

interface ImageViewerProps {
  file: FileResponse;
}

export const ImageViewer = ({ file }: ImageViewerProps) => (
  <MainPageArea>
    <Image src={file.blobUrl ?? ''} alt={file.filename ?? 'Image'} />
  </MainPageArea>
);
