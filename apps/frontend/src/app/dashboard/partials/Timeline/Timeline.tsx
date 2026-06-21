'use client';

import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';
import { Button, Icon } from '@/ui';

import { timeToPixel } from './layout';
import { AudioClip } from './partials/AudioClip';
import { Clip } from './partials/Clip';
import { Ruler } from './partials/Ruler';
import {
  Actions,
  ActionsRow,
  AudioTrack,
  Container,
  EmptyHint,
  Track,
  TrackLabel,
  TrackRow,
  TracksWrapper,
  ZoomRange,
} from './styled';

export const ZOOM_LEVELS = [5, 10, 20, 40, 80] as const;

export const Timeline = ({
  files,
  isFileDragActive = false,
}: {
  files: FileResponse[];
  isFileDragActive?: boolean;
}) => {
  const clips = useTimelineStore(state => state.clips);
  const audioClips = useTimelineStore(state => state.audioClips);
  const committedClips = useTimelineStore(state => state.committedClips);
  const committedAudioClips = useTimelineStore(state => state.committedAudioClips);
  const commitClips = useTimelineStore(state => state.commitClips);
  const selectedInstanceId = useTimelineStore(state => state.selectedInstanceId);
  const removeClip = useTimelineStore(state => state.removeClip);
  const removeAudioClip = useTimelineStore(state => state.removeAudioClip);
  const selectClip = useTimelineStore(state => state.selectClip);
  const setSelectedFile = usePreviewStore(state => state.setSelectedFile);

  const [zoomIndex, setZoomIndex] = useState(1);
  const pixelsPerSecond = ZOOM_LEVELS[zoomIndex];

  const isDirty =
    JSON.stringify(clips) !== JSON.stringify(committedClips) ||
    JSON.stringify(audioClips) !== JSON.stringify(committedAudioClips);

  const { setNodeRef: setMainRef, isOver: isOverMain } = useDroppable({ id: 'timeline-track' });
  const { setNodeRef: setAudioRef, isOver: isOverAudio } = useDroppable({ id: 'audio-track' });

  const fileMap = useMemo(() => new Map(files.map(f => [f.fileId, f])), [files]);
  const clipIds = useMemo(() => clips.map(c => c.instanceId), [clips]);

  // Cumulative start times of all main-track clips, plus the end of the last clip.
  // Clips are contiguous (gap: 0, no horizontal padding) so these are pure time values
  // that remain valid across all zoom levels.
  const mainSnapTimes = useMemo(() => {
    const times = clips.map((_, i) => clips.slice(0, i).reduce((sum, c) => sum + c.duration, 0));
    if (clips.length > 0) {
      times.push(clips.reduce((sum, c) => sum + c.duration, 0));
    }
    return times;
  }, [clips]);

  const audioTrackWidth = useMemo(() => {
    const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);
    const mainLayoutWidth =
      clips.length > 0 ? timeToPixel(totalDuration, clips, pixelsPerSecond) : 0;

    const maxAudioEndPx = audioClips.reduce((max, clip) => {
      const left = timeToPixel(clip.startTime ?? 0, clips, pixelsPerSecond);
      return Math.max(max, left + clip.duration * pixelsPerSecond);
    }, 0);

    return Math.max(mainLayoutWidth, maxAudioEndPx, 200);
  }, [audioClips, clips, pixelsPerSecond]);

  const resetSelection = () => {
    if (selectedInstanceId) selectClip(null);
  };

  return (
    <Container onClick={resetSelection}>
      <TracksWrapper>
        <TrackRow>
          <TrackLabel aria-hidden>
            <span style={{ width: 20, height: 20, flexShrink: 0 }} />
          </TrackLabel>
          <Ruler clips={clips} pixelsPerSecond={pixelsPerSecond} />
        </TrackRow>

        <TrackRow>
          <TrackLabel>
            <Icon name='images' size={20} color='text.tertiary' />
          </TrackLabel>
          <Track
            ref={setMainRef}
            $isFileDragActive={isFileDragActive}
            $isOver={isOverMain}
            $isEmpty={clips.length === 0}
          >
            {clips.length === 0 ? (
              <EmptyHint>Drag images, videos, or slides here</EmptyHint>
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
                      pixelsPerSecond={pixelsPerSecond}
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
        </TrackRow>

        <TrackRow>
          <TrackLabel>
            <Icon name='musical-notes' size={20} color='text.tertiary' />
          </TrackLabel>
          <AudioTrack
            ref={setAudioRef}
            $isFileDragActive={isFileDragActive}
            $isOver={isOverAudio}
            $isEmpty={audioClips.length === 0}
            $width={audioTrackWidth}
          >
            {audioClips.length === 0 ? (
              <EmptyHint>Drag audio files here</EmptyHint>
            ) : (
              audioClips.map(clip => {
                const file = fileMap.get(clip.fileId);
                if (!file) return null;
                return (
                  <AudioClip
                    key={clip.instanceId}
                    clip={clip}
                    file={file}
                    pixelsPerSecond={pixelsPerSecond}
                    mainSnapTimes={mainSnapTimes}
                    left={timeToPixel(clip.startTime ?? 0, clips, pixelsPerSecond)}
                    isSelected={selectedInstanceId === clip.instanceId}
                    onSelect={() => {
                      selectClip(clip.instanceId);
                      setSelectedFile(file);
                    }}
                    onRemove={() => removeAudioClip(clip.instanceId)}
                  />
                );
              })
            )}
          </AudioTrack>
        </TrackRow>
      </TracksWrapper>

      <ActionsRow>
        <Actions>
          {isDirty && (
            <Button variant='ghost' onClick={commitClips}>
              <Icon name='sync-outline' size={16} />
            </Button>
          )}
          <ZoomRange
            type='range'
            min={0}
            max={4}
            step={1}
            value={zoomIndex}
            onChange={e => setZoomIndex(Number(e.target.value))}
          />
        </Actions>
      </ActionsRow>
    </Container>
  );
};
