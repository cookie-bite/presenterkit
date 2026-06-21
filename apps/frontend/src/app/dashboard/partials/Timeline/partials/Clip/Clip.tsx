'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';

import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import { FileResponse } from '@/lib/api/file.api';
import { TimelineClip, useTimelineStore } from '@/lib/stores/timeline.store';
import { isAudioFile, isVideoFile } from '@/lib/utils/timeline';
import { Icon } from '@/ui';

import {
  Container,
  Inner,
  RemoveButton,
  ResizeHandle,
  ThumbnailBg,
  ThumbnailPlaceholder,
} from './styled';

const SNAP_THRESHOLD_PX = 8;
const MIN_DURATION = 1;

interface ClipProps {
  clip: TimelineClip;
  file: FileResponse;
  pixelsPerSecond: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const Clip = ({
  clip,
  file,
  pixelsPerSecond,
  isSelected,
  onSelect,
  onRemove,
}: ClipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: clip.instanceId,
    data: { type: 'clip', fileId: clip.fileId, instanceId: clip.instanceId },
  });

  const resizeClip = useTimelineStore(state => state.resizeClip);
  const clips = useTimelineStore(state => state.clips);
  const startXRef = useRef<number>(0);
  const startDurationRef = useRef<number>(clip.duration);

  const width = Math.max(clip.duration * pixelsPerSecond, MIN_DURATION * pixelsPerSecond);
  const isAudio = isAudioFile(file);
  const isVideo = isVideoFile(file);
  const isResizable = !isVideo && !isAudio;

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    startXRef.current = e.clientX;
    startDurationRef.current = clip.duration;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons === 0) return;
    const deltaX = e.clientX - startXRef.current;
    let newDuration = startDurationRef.current + deltaX / pixelsPerSecond;
    newDuration = Math.max(newDuration, MIN_DURATION);

    newDuration = Math.round(newDuration * 2) / 2;

    const myIndex = clips.findIndex(c => c.instanceId === clip.instanceId);
    if (myIndex !== -1 && myIndex < clips.length - 1) {
      const startOfNext = clips.slice(0, myIndex + 1).reduce((acc, c) => acc + c.duration, 0);
      const currentEnd =
        clips.slice(0, myIndex).reduce((acc, c) => acc + c.duration, 0) + newDuration;
      const gapPx = (startOfNext - currentEnd) * pixelsPerSecond;
      if (Math.abs(gapPx) < SNAP_THRESHOLD_PX) {
        newDuration = startOfNext - clips.slice(0, myIndex).reduce((acc, c) => acc + c.duration, 0);
        newDuration = Math.max(newDuration, MIN_DURATION);
      }
    }

    resizeClip(clip.instanceId, newDuration);
  }

  function handleResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

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
      $width={width}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Inner>
        {isSelected && (
          <RemoveButton
            variant='ghost'
            $offsetForResize={isResizable}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              trackEvent(AnalyticsEvents.clipRemovedFromTimeline, {
                file_id: clip.fileId,
                file_name: file.filename,
              });
              onRemove();
            }}
          >
            <Icon name='trash-outline' size={12} color='text.secondary' />
          </RemoveButton>
        )}
        {isAudio ? (
          <ThumbnailPlaceholder>
            <Icon name='musical-notes' size={24} color='text.tertiary' />
          </ThumbnailPlaceholder>
        ) : file.thumbnailUrl ? (
          <ThumbnailBg $url={file.thumbnailUrl} />
        ) : (
          <ThumbnailPlaceholder />
        )}
      </Inner>
      {isResizable && (
        <ResizeHandle
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
    </Container>
  );
};
