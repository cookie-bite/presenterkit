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

import { getTimeline, updateTimeline } from '@/lib/api/timeline.api';
import { useFiles } from '@/lib/hooks/useFiles';
import { useTimelineStore } from '@/lib/stores/timeline.store';

import { Displays } from './partials/Displays';
import { DragOverlayThumbnail } from './partials/DragOverlay';
import { Files } from './partials/Files';
import { Menu } from './partials/Menu';
import { NoFiles } from './partials/NoFiles';
import { Preview } from './partials/Preview';
import { Timeline } from './partials/Timeline';
import { Container, PanelResizer, SaveFailedHint } from './styled';

interface ActiveDrag {
  type: 'file' | 'clip';
  fileId: number;
}

export default function Dashboard() {
  const { files, hasFiles } = useFiles();
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [timelineHydrated, setTimelineHydrated] = useState(false);
  const [showSaveFailed, setShowSaveFailed] = useState(false);
  const lastSavedClipsRef = useRef<string | null>(null);
  const { clips, setClips } = useTimelineStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const result = await getTimeline();
      if (isMounted && result && !('error' in result)) {
        setClips(result.clips);
        lastSavedClipsRef.current = JSON.stringify(result.clips);
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

    const serializedClips = JSON.stringify(clips);
    if (serializedClips === lastSavedClipsRef.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void (async () => {
        const result = await updateTimeline(clips);
        if (result && !('error' in result)) {
          lastSavedClipsRef.current = JSON.stringify(result.clips);
          setShowSaveFailed(false);
          return;
        }

        setShowSaveFailed(true);
      })();
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [clips, timelineHydrated]);

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

    const { clips, addClip, reorderClips } = useTimelineStore.getState();
    const activeData = active.data.current;

    if (activeData?.type === 'file') {
      const overId = String(over.id);
      const isOverTimeline =
        overId === 'timeline-track' || clips.some(c => c.instanceId === overId);
      if (isOverTimeline) {
        addClip(activeData.fileId);
      }
    } else if (activeData?.type === 'clip') {
      const oldIndex = clips.findIndex(c => c.instanceId === String(active.id));
      const newIndex = clips.findIndex(c => c.instanceId === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderClips(oldIndex, newIndex);
      }
    }
  }

  const overlayFile = activeDrag ? (files.find(f => f.fileId === activeDrag.fileId) ?? null) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container>
        <Menu />
        {showSaveFailed && <SaveFailedHint>Save failed</SaveFailedHint>}
        {!hasFiles ? (
          <NoFiles />
        ) : (
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
            <Panel defaultSize={20}>
              <Timeline files={files} />
            </Panel>
          </PanelGroup>
        )}
      </Container>
      <DragOverlay dropAnimation={null}>
        {overlayFile && <DragOverlayThumbnail file={overlayFile} />}
      </DragOverlay>
    </DndContext>
  );
}
