'use client';

import { useRef } from 'react';

import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import { FileResponse } from '@/lib/api/file.api';
import { TimelineClip, useTimelineStore } from '@/lib/stores/timeline.store';
import { Icon } from '@/ui';

import { Container, Inner, Label, RemoveButton } from './styled';

const SNAP_THRESHOLD_PX = 8;
const MIN_DURATION = 1;

interface AudioClipProps {
  clip: TimelineClip;
  file: FileResponse;
  pixelsPerSecond: number;
  /** Start times of all main-track clips (for snapping). */
  mainSnapTimes: number[];
  /** Pre-computed pixel offset from Timeline, accounting for main-track gaps. */
  left: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioClip = ({
  clip,
  file,
  pixelsPerSecond,
  mainSnapTimes,
  left,
  isSelected,
  onSelect,
  onRemove,
}: AudioClipProps) => {
  const moveAudioClip = useTimelineStore(state => state.moveAudioClip);
  const audioClips = useTimelineStore(state => state.audioClips);

  const startTime = clip.startTime ?? 0;
  const width = Math.max(clip.duration * pixelsPerSecond, MIN_DURATION * pixelsPerSecond);

  // ── Move (drag clip body) ──────────────────────────────────────────────
  const moveStartXRef = useRef<number>(0);
  const moveStartTimeRef = useRef<number>(startTime);

  function handleMovePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    moveStartXRef.current = e.clientX;
    moveStartTimeRef.current = startTime;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleMovePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons === 0) return;
    const deltaX = e.clientX - moveStartXRef.current;
    let newStart = moveStartTimeRef.current + deltaX / pixelsPerSecond;
    newStart = Math.max(0, newStart);

    // Snap to main-track clip boundaries
    const snapThresholdSec = SNAP_THRESHOLD_PX / pixelsPerSecond;
    for (const t of mainSnapTimes) {
      if (Math.abs(newStart - t) < snapThresholdSec) {
        newStart = t;
        break;
      }
    }

    // Clamp to avoid overlapping other audio clips
    const others = audioClips
      .filter(c => c.instanceId !== clip.instanceId)
      .sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0));

    let minStart = 0;
    let maxStart = Infinity;

    for (const other of others) {
      const oStart = other.startTime ?? 0;
      const oEnd = oStart + other.duration;

      if (oEnd <= newStart) {
        minStart = Math.max(minStart, oEnd);
      } else if (oStart >= newStart + clip.duration) {
        maxStart = Math.min(maxStart, oStart - clip.duration);
        break;
      } else {
        // Overlapping — push to whichever side is closer
        const distToLeft = newStart - oStart;
        const distToRight = oEnd - (newStart + clip.duration);
        if (distToLeft <= distToRight) {
          maxStart = Math.min(maxStart, oStart - clip.duration);
        } else {
          minStart = Math.max(minStart, oEnd);
        }
      }
    }

    newStart = Math.max(minStart, Math.min(newStart, maxStart === Infinity ? newStart : maxStart));
    newStart = Math.max(0, newStart);

    moveAudioClip(clip.instanceId, newStart);
  }

  function handleMovePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <Container $isSelected={isSelected} $width={width} $left={left}>
      <Inner
        onPointerDown={handleMovePointerDown}
        onPointerMove={handleMovePointerMove}
        onPointerUp={handleMovePointerUp}
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {isSelected && (
          <RemoveButton
            variant='ghost'
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
        <Icon name='musical-notes' size={16} color='text.tertiary' />
        <Label>{file.filename}</Label>
      </Inner>
    </Container>
  );
};
