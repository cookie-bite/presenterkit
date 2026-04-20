import { FileResponse } from '@/lib/api/file.api';

import { Stage } from '../../styled';
import { Image } from './styled';

interface ImageViewerProps {
  file: FileResponse;
}

export const ImageViewer = ({ file }: ImageViewerProps) => (
  <Stage>
    <Image src={file.blobUrl ?? ''} alt={file.filename ?? 'Image'} />
  </Stage>
);
