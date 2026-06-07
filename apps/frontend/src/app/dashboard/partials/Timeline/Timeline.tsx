'use client';

import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useMemo } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';
import { Button, Icon } from '@/ui';

import { Clip } from './partials/Clip';
import { ActionsRow, Container, EmptyHint, Track } from './styled';

export const Timeline = ({
  files,
  isFileDragActive = false,
}: {
  files: FileResponse[];
  isFileDragActive?: boolean;
}) => {
  const clips = useTimelineStore(state => state.clips);
  const committedClips = useTimelineStore(state => state.committedClips);
  const commitClips = useTimelineStore(state => state.commitClips);
  const selectedInstanceId = useTimelineStore(state => state.selectedInstanceId);
  const removeClip = useTimelineStore(state => state.removeClip);
  const selectClip = useTimelineStore(state => state.selectClip);
  const setSelectedFile = usePreviewStore(state => state.setSelectedFile);

  const isDirty = JSON.stringify(clips) !== JSON.stringify(committedClips);
  const { setNodeRef, isOver } = useDroppable({ id: 'timeline-track' });

  const fileMap = useMemo(() => new Map(files.map(f => [f.fileId, f])), [files]);
  const clipIds = useMemo(() => clips.map(c => c.instanceId), [clips]);

  const isEmpty = clips.length === 0;

  const resetSelection = () => {
    if (!isEmpty && selectedInstanceId) {
      selectClip(null);
    }
  };

  return (
    <Container onClick={resetSelection}>
      {isDirty && (
        <ActionsRow>
          <Button variant='ghost' onClick={commitClips}>
            <Icon name='sync-outline' size={16} />
          </Button>
        </ActionsRow>
      )}
      <Track
        ref={setNodeRef}
        $isFileDragActive={isFileDragActive}
        $isOver={isOver}
        $isEmpty={isEmpty}
      >
        {isEmpty ? (
          <EmptyHint>Step 3: Drag your selected files here to build the event timeline.</EmptyHint>
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
