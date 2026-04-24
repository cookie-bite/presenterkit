'use client';

import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useMemo } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';

import { Clip } from './partials/Clip';
import { Container, EmptyHint, Track } from './styled';

export const Timeline = ({
  files,
  isFileDragActive = false,
}: {
  files: FileResponse[];
  isFileDragActive?: boolean;
}) => {
  const { clips, selectedInstanceId, removeClip, selectClip } = useTimelineStore();
  const { setSelectedFile } = usePreviewStore();
  const { setNodeRef, isOver } = useDroppable({ id: 'timeline-track' });

  const fileMap = useMemo(() => new Map(files.map(f => [f.fileId, f])), [files]);
  const clipIds = useMemo(() => clips.map(c => c.instanceId), [clips]);

  const isEmpty = clips.length === 0;

  return (
    <Container onClick={() => selectClip(null)}>
      <Track
        ref={setNodeRef}
        $isFileDragActive={isFileDragActive}
        $isOver={isOver}
        $isEmpty={isEmpty}
      >
        {isEmpty ? (
          <EmptyHint>Drag files here to build your event flow</EmptyHint>
        ) : (
          <SortableContext items={clipIds} strategy={horizontalListSortingStrategy}>
            {clips.map(clip => {
              const file = fileMap.get(clip.fileId);
              if (!file) return null;
              return (
                <Clip
                  key={clip.instanceId}
                  clip={clip}
                  file={file}
                  isSelected={selectedInstanceId === clip.instanceId}
                  onSelect={() => {
                    selectClip(clip.instanceId);
                    setSelectedFile(file);
                  }}
                  onRemove={() => removeClip(clip.instanceId)}
                />
              );
            })}
          </SortableContext>
        )}
      </Track>
    </Container>
  );
};
