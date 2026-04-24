import { useCallback, useEffect, useMemo } from 'react';

import { DisplayChannelMessage, useDisplayChannel } from '@/lib/hooks/useDisplayChannel';
import { useFiles } from '@/lib/hooks/useFiles';
import { useOfflineStatus } from '@/lib/hooks/useOfflineStatus';
import { useDisplayStore } from '@/lib/stores/display.store';
import { useTimelineStore } from '@/lib/stores/timeline.store';
import { buildTimelineSteps } from '@/lib/utils/timeline';
import { Button, Icon, Panel, ScrollView } from '@/ui';

import { EmptyHint } from '../../styled';
import { DisplayCard } from './partials/DisplayCard';
import { Container, List, OfflineHint } from './styled';

export const Displays = () => {
  const { isOffline } = useOfflineStatus();
  const { files } = useFiles();
  const { clips } = useTimelineStore();
  const { displays, upsertDisplay, setDisplayStatus, setDisplayStep, setWindowRef, removeDisplay } =
    useDisplayStore();

  const activeDisplay = displays[0] ?? null;
  const canAddDisplay = (!activeDisplay || activeDisplay.status === 'blocked') && !isOffline;

  const steps = useMemo(() => buildTimelineSteps(clips, files), [clips, files]);

  const handleMessage = useCallback(
    (message: DisplayChannelMessage) => {
      if (!activeDisplay) return;

      if (message.type === 'READY') {
        setDisplayStatus(activeDisplay.id, 'connected');
        return;
      }

      if (message.type === 'ACK') {
        const bounded = Math.min(Math.max(message.stepIndex, 0), Math.max(steps.length - 1, 0));
        setDisplayStep(activeDisplay.id, bounded);
        return;
      }

      if (message.type === 'CLOSING') {
        removeDisplay(activeDisplay.id);
      }
    },
    [activeDisplay, removeDisplay, setDisplayStatus, setDisplayStep, steps.length],
  );

  const { send } = useDisplayChannel(activeDisplay?.id ?? null, handleMessage);

  useEffect(() => {
    if (!activeDisplay || activeDisplay.status !== 'connected') return;
    send({
      type: 'SYNC',
      clips,
      files,
      stepIndex: Math.min(Math.max(activeDisplay.stepIndex, 0), Math.max(steps.length - 1, 0)),
    });
  }, [activeDisplay, clips, files, send, steps.length]);

  useEffect(() => {
    if (!activeDisplay?.windowRef) return;

    const interval = window.setInterval(() => {
      if (activeDisplay.windowRef?.closed) {
        removeDisplay(activeDisplay.id);
      }
    }, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeDisplay, removeDisplay]);

  useEffect(() => {
    if (!activeDisplay || activeDisplay.status !== 'connected') return;

    const onKeyUp = (event: KeyboardEvent) => {
      const bounded = Math.min(Math.max(activeDisplay.stepIndex, 0), Math.max(steps.length - 1, 0));

      if (event.key === 'PageUp') {
        const next = Math.max(bounded - 1, 0);
        setDisplayStep(activeDisplay.id, next);
        send({ type: 'STEP', stepIndex: next });
      }

      if (event.key === 'PageDown') {
        const next = Math.min(bounded + 1, Math.max(steps.length - 1, 0));
        setDisplayStep(activeDisplay.id, next);
        send({ type: 'STEP', stepIndex: next });
      }
    };

    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [activeDisplay, send, setDisplayStep, steps.length]);

  useEffect(() => {
    if (!activeDisplay || activeDisplay.status !== 'connected') return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [activeDisplay]);

  const openDisplay = useCallback(() => {
    if (isOffline) return;
    if (activeDisplay && activeDisplay.status !== 'blocked') return;

    if (activeDisplay?.status === 'blocked') {
      const retryWindow = window.open(`/display/${activeDisplay.id}`, '_blank');
      if (!retryWindow) return;
      setWindowRef(activeDisplay.id, retryWindow);
      setDisplayStatus(activeDisplay.id, 'pending');
      return;
    }

    const id = crypto.randomUUID();
    const name = 'Display 1';
    const windowRef = window.open(`/display/${id}`, '_blank');

    if (!windowRef) {
      upsertDisplay({
        id,
        name,
        status: 'blocked',
        stepIndex: 0,
        windowRef: null,
      });
      return;
    }

    upsertDisplay({
      id,
      name,
      status: 'pending',
      stepIndex: 0,
      windowRef,
    });
  }, [activeDisplay, isOffline, setDisplayStatus, setWindowRef, upsertDisplay]);

  const updateStep = useCallback(
    (delta: number) => {
      if (!activeDisplay || activeDisplay.status !== 'connected') return;
      const bounded = Math.min(
        Math.max(activeDisplay.stepIndex + delta, 0),
        Math.max(steps.length - 1, 0),
      );
      setDisplayStep(activeDisplay.id, bounded);
      send({ type: 'STEP', stepIndex: bounded });
    },
    [activeDisplay, send, setDisplayStep, steps.length],
  );

  const currentStep = activeDisplay
    ? Math.min(Math.max(activeDisplay.stepIndex, 0), Math.max(steps.length - 1, 0))
    : 0;
  const currentSrc = steps[currentStep]?.src ?? null;

  return (
    <Panel
      title='Displays'
      actions={
        <Button variant='ghost' onClick={openDisplay} disabled={!canAddDisplay}>
          <Icon name='add' />
        </Button>
      }
    >
      <Container>
        {isOffline && <OfflineHint>Offline: existing display control only</OfflineHint>}
        {!activeDisplay ? (
          <EmptyHint>No displays</EmptyHint>
        ) : (
          <ScrollView $gap='8px' $padding='0'>
            <List>
              <DisplayCard
                name={activeDisplay.name}
                status={activeDisplay.status}
                currentSrc={currentSrc}
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrev={() => updateStep(-1)}
                onNext={() => updateStep(1)}
              />
            </List>
          </ScrollView>
        )}
      </Container>
    </Panel>
  );
};
