'use client';

import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';
import { Button, Icon } from '@/ui';

import { AudioClip } from './partials/AudioClip';
import { Clip } from './partials/Clip';
import {
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

// Must match Track's CSS padding and gap values.
const TRACK_PADDING_PX = 8;
const CLIP_GAP_PX = 8;

/**
 * Converts a pure time value (seconds) to a pixel offset within the AudioTrack,
 * accounting for the fixed-pixel gaps between main-track clips so the audio
 * track stays aligned at every zoom level.
 */
function timeToPixel(time: number, clips: Array<{ duration: number }>, pps: number): number {
  let gapCount = 0;
  let cumTime = 0;
  for (const clip of clips) {
    if (cumTime >= time) break;
    cumTime += clip.duration;
    if (cumTime <= time) gapCount++;
  }
  return TRACK_PADDING_PX + time * pps + gapCount * CLIP_GAP_PX;
}

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

  const mainTrackWidth = useMemo(
    () => clips.reduce((sum, c) => sum + c.duration, 0) * pixelsPerSecond,
    [clips, pixelsPerSecond],
  );

  const audioTrackWidth = useMemo(() => {
    const maxEnd = audioClips.reduce((max, c) => Math.max(max, (c.startTime ?? 0) + c.duration), 0);
    return Math.max(mainTrackWidth, maxEnd * pixelsPerSecond, 200);
  }, [audioClips, mainTrackWidth, pixelsPerSecond]);

  const resetSelection = () => {
    if (selectedInstanceId) selectClip(null);
  };

  return (
    <Container onClick={resetSelection}>
      <ActionsRow>
        <ZoomRange
          type='range'
          min={0}
          max={4}
          step={1}
          value={zoomIndex}
          onChange={e => setZoomIndex(Number(e.target.value))}
        />
        {isDirty && (
          <Button variant='ghost' onClick={commitClips}>
            <Icon name='sync-outline' size={16} />
          </Button>
        )}
      </ActionsRow>

      <TracksWrapper>
        <TrackRow>
          <TrackLabel>Video</TrackLabel>
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
          <TrackLabel>Audio</TrackLabel>
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
    </Container>
  );
};
