import { useCallback, useEffect, useMemo, useRef } from 'react';

import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
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
  const {
    displays,
    clickerDisplayId,
    upsertDisplay,
    setDisplayStatus,
    setDisplayStep,
    setWindowRef,
    setClickerDisplay,
    removeDisplay,
  } = useDisplayStore();

  const activeDisplay = displays[0] ?? null;
  const canAddDisplay = (!activeDisplay || activeDisplay.status === 'blocked') && !isOffline;

  const steps = useMemo(() => buildTimelineSteps(clips, files), [clips, files]);

  // Ref updated every render so the stable keydown listener always reads current values
  // without needing to re-register on every step or display change.
  const clickerRef = useRef<{
    clickerDisplayId: string | null;
    displays: typeof displays;
    stepsLength: number;
  }>({ clickerDisplayId: null, displays: [], stepsLength: 0 });
  clickerRef.current = { clickerDisplayId, displays, stepsLength: steps.length };

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
      steps: steps.map(({ file: _, ...rest }) => rest),
      stepIndex: Math.min(Math.max(activeDisplay.stepIndex, 0), Math.max(steps.length - 1, 0)),
    });
  }, [activeDisplay, send, steps]);

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'PageUp' && event.key !== 'PageDown') return;

      const { clickerDisplayId, displays, stepsLength } = clickerRef.current;
      if (!clickerDisplayId) return;

      const display = displays.find(d => d.id === clickerDisplayId);
      if (!display || display.status !== 'connected') return;

      event.preventDefault();

      const bounded = Math.min(Math.max(display.stepIndex, 0), Math.max(stepsLength - 1, 0));
      const next =
        event.key === 'PageUp'
          ? Math.max(bounded - 1, 0)
          : Math.min(bounded + 1, Math.max(stepsLength - 1, 0));

      setDisplayStep(display.id, next);

      const ch = new BroadcastChannel(`display-${display.id}`);
      ch.postMessage({ type: 'STEP', stepIndex: next });
      ch.close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const displayUrl = useCallback((id: string, name: string) => {
    const params = new URLSearchParams({ name });
    return `/display/${id}?${params.toString()}`;
  }, []);

  const openDisplay = useCallback(() => {
    if (isOffline) return;
    if (activeDisplay && activeDisplay.status !== 'blocked') return;

    if (activeDisplay?.status === 'blocked') {
      const retryWindow = window.open(displayUrl(activeDisplay.id, activeDisplay.name), '_blank');
      if (!retryWindow) return;
      setWindowRef(activeDisplay.id, retryWindow);
      setDisplayStatus(activeDisplay.id, 'pending');
      return;
    }

    const id = crypto.randomUUID();
    const name = 'Display 1';
    const windowRef = window.open(displayUrl(id, name), '_blank');

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
    trackEvent(AnalyticsEvents.displayOpened, { display_id: id });
  }, [activeDisplay, displayUrl, isOffline, setDisplayStatus, setWindowRef, upsertDisplay]);

  const updateStep = useCallback(
    (delta: number) => {
      if (!activeDisplay || activeDisplay.status !== 'connected') return;
      const bounded = Math.min(
        Math.max(activeDisplay.stepIndex + delta, 0),
        Math.max(steps.length - 1, 0),
      );
      setDisplayStep(activeDisplay.id, bounded);
      send({ type: 'STEP', stepIndex: bounded });
      trackEvent(AnalyticsEvents.displayStepNavigated, {
        display_id: activeDisplay.id,
        direction: delta > 0 ? 'next' : 'prev',
        step_index: bounded,
        total_steps: steps.length,
      });
    },
    [activeDisplay, send, setDisplayStep, steps.length],
  );

  const toggleClicker = useCallback(
    (id: string) => {
      setClickerDisplay(clickerDisplayId === id ? null : id);
    },
    [clickerDisplayId, setClickerDisplay],
  );

  const currentStep = activeDisplay
    ? Math.min(Math.max(activeDisplay.stepIndex, 0), Math.max(steps.length - 1, 0))
    : 0;
  const currentStepData = steps[currentStep];
  const currentSrc = currentStepData?.src ?? null;
  const currentKind = currentStepData?.kind ?? null;

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
          <EmptyHint>
            Step 4: Add a display window to show this timeline on the stage monitor.
          </EmptyHint>
        ) : (
          <ScrollView $gap='8px' $padding='0'>
            <List>
              <DisplayCard
                name={activeDisplay.name}
                status={activeDisplay.status}
                currentKind={currentKind}
                currentSrc={currentSrc}
                currentStep={currentStep}
                totalSteps={steps.length}
                isClickerAssigned={clickerDisplayId === activeDisplay.id}
                onPrev={() => updateStep(-1)}
                onNext={() => updateStep(1)}
                onToggleClicker={() => toggleClicker(activeDisplay.id)}
              />
            </List>
          </ScrollView>
        )}
      </Container>
    </Panel>
  );
};
