'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FileResponse } from '@/lib/api/file.api';
import { TimelineClip } from '@/lib/stores/timeline.store';
import { Icon } from '@/ui';

import { Container, RemoveButton, Thumbnail, ThumbnailPlaceholder } from './styled';

interface ClipProps {
  clip: TimelineClip;
  file: FileResponse;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const Clip = ({ clip, file, isSelected, onSelect, onRemove }: ClipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: clip.instanceId,
    data: { type: 'clip', fileId: clip.fileId, instanceId: clip.instanceId },
  });

  return (
    <Container
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
      $isSelected={isSelected}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <RemoveButton
          variant='ghost'
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name='trash-outline' size={12} color='text.secondary' />
        </RemoveButton>
      )}
      {file.thumbnailUrl ? (
        <Thumbnail
          src={file.thumbnailUrl}
          alt={file.filename ?? ''}
          width={0}
          height={0}
          sizes='100vw'
          draggable={false}
        />
      ) : (
        <ThumbnailPlaceholder />
      )}
    </Container>
  );
};
