import { FileResponse } from '@/lib/api/file.api';

import { OverlayClipThumbnail, OverlayClipWrapper } from './styled';

interface DragOverlayThumbnailProps {
  file: FileResponse;
}

export const DragOverlayThumbnail = ({ file }: DragOverlayThumbnailProps) => {
  if (!file.thumbnailUrl) return null;
  return (
    <OverlayClipWrapper>
      <OverlayClipThumbnail
        src={file.thumbnailUrl}
        alt={file.filename ?? ''}
        width={0}
        height={0}
        sizes='100vw'
        draggable={false}
      />
    </OverlayClipWrapper>
  );
};
