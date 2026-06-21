'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import { getTimeline, updateTimeline } from '@/lib/api/timeline.api';
import { useFiles } from '@/lib/hooks/useFiles';
import { useTimelineStore } from '@/lib/stores/timeline.store';
import { getDefaultDuration, isAudioFile } from '@/lib/utils/timeline';

import { Displays } from './partials/Displays';
import { DragOverlayThumbnail } from './partials/DragOverlay';
import { Files } from './partials/Files';
import { Menu } from './partials/Menu';
import { Preview } from './partials/Preview';
import { Timeline } from './partials/Timeline';
import { Container, PanelResizer, SaveFailedHint } from './styled';

interface ActiveDrag {
  type: 'file' | 'clip';
  fileId: number;
}

export default function Dashboard() {
  const { files } = useFiles();
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [timelineHydrated, setTimelineHydrated] = useState(false);
  const [showSaveFailed, setShowSaveFailed] = useState(false);
  const lastSavedClipsRef = useRef<string | null>(null);
  const { clips, audioClips, setClips } = useTimelineStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const result = await getTimeline();
      if (isMounted && result && !('error' in result)) {
        setClips(result.clips, result.audioClips ?? []);
        lastSavedClipsRef.current = JSON.stringify({
          clips: result.clips,
          audioClips: result.audioClips ?? [],
        });
      }
      if (isMounted) {
        setTimelineHydrated(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setClips]);

  useEffect(() => {
    if (!timelineHydrated) {
      return;
    }

    const serialized = JSON.stringify({ clips, audioClips });
    if (serialized === lastSavedClipsRef.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void (async () => {
        const result = await updateTimeline(clips, audioClips);
        if (result && !('error' in result)) {
          lastSavedClipsRef.current = JSON.stringify({
            clips: result.clips,
            audioClips: result.audioClips ?? [],
          });
          setShowSaveFailed(false);
          return;
        }

        setShowSaveFailed(true);
      })();
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [clips, audioClips, timelineHydrated]);

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === 'file' || data?.type === 'clip') {
      setActiveDrag({ type: data.type, fileId: data.fileId });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;

    const { clips, audioClips, addClip, addAudioClip, reorderClips } = useTimelineStore.getState();
    const activeData = active.data.current;

    if (activeData?.type === 'file') {
      const overId = String(over.id);
      const file = files.find(f => f.fileId === activeData.fileId);
      if (!file) return;

      const isAudio = isAudioFile(file);

      const isOverAudioTrack =
        overId === 'audio-track' || audioClips.some(c => c.instanceId === overId);
      const isOverMainTrack =
        overId === 'timeline-track' || clips.some(c => c.instanceId === overId);

      if (isOverAudioTrack && isAudio) {
        addAudioClip(file.fileId, getDefaultDuration(file));
        trackEvent(AnalyticsEvents.clipAddedToTimeline, { file_id: file.fileId });
      } else if (isOverMainTrack && !isAudio) {
        addClip(file.fileId, getDefaultDuration(file));
        trackEvent(AnalyticsEvents.clipAddedToTimeline, { file_id: file.fileId });
      }
    } else if (activeData?.type === 'clip') {
      const oldIndex = clips.findIndex(c => c.instanceId === String(active.id));
      const newIndex = clips.findIndex(c => c.instanceId === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderClips(oldIndex, newIndex);
        trackEvent(AnalyticsEvents.clipReorderedInTimeline, {
          old_index: oldIndex,
          new_index: newIndex,
        });
      }
    }
  }

  const overlayFile = activeDrag ? (files.find(f => f.fileId === activeDrag.fileId) ?? null) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container>
        <Menu />
        {showSaveFailed && <SaveFailedHint>Save failed</SaveFailedHint>}
        <PanelGroup direction='vertical'>
          <Panel>
            <PanelGroup direction='horizontal'>
              <Panel defaultSize={20}>
                <Files files={files} />
              </Panel>
              <PanelResizer />
              <Panel>
                <Preview />
              </Panel>
              <PanelResizer />
              <Panel defaultSize={20}>
                <Displays />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizer />
          <Panel defaultSize={21}>
            <Timeline files={files} isFileDragActive={activeDrag?.type === 'file'} />
          </Panel>
        </PanelGroup>
      </Container>
      <DragOverlay dropAnimation={null}>
        {overlayFile && <DragOverlayThumbnail file={overlayFile} />}
      </DragOverlay>
    </DndContext>
  );
}
