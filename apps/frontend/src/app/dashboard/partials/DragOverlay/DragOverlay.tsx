import { FileResponse } from '@/lib/api/file.api';
import { isAudioFile } from '@/lib/utils/timeline';
import { Icon } from '@/ui';

import { AudioOverlay, OverlayClipThumbnail, OverlayClipWrapper } from './styled';

interface DragOverlayThumbnailProps {
  file: FileResponse;
}

export const DragOverlayThumbnail = ({ file }: DragOverlayThumbnailProps) => {
  if (isAudioFile(file)) {
    return (
      <OverlayClipWrapper>
        <AudioOverlay>
          <Icon name='musical-notes' size={32} color='text.tertiary' />
        </AudioOverlay>
      </OverlayClipWrapper>
    );
  }

  if (!file.thumbnailUrl) return null;

  return (
    <OverlayClipWrapper>
      <OverlayClipThumbnail
        src={file.thumbnailUrl}
        alt={file.filename ?? ''}
        width={file.thumbnailWidth ?? 0}
        height={file.thumbnailHeight ?? 0}
        sizes='100vw'
        draggable={false}
      />
    </OverlayClipWrapper>
  );
};
