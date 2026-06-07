'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DisplayChannelMessage,
  DisplayStep,
  useDisplayChannel,
} from '@/lib/hooks/useDisplayChannel';

import { Container, ImageStep, Stage, Status, VideoStep } from './styled';

interface DisplayScreenProps {
  displayId: string;
}

export const DisplayScreen = ({ displayId }: DisplayScreenProps) => {
  const [steps, setSteps] = useState<DisplayStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const boundedStepIndex = Math.min(Math.max(stepIndex, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[boundedStepIndex];

  const lastVideoSrc = useMemo(() => {
    for (let i = boundedStepIndex; i >= 0; i--) {
      if (steps[i]?.kind === 'video' && steps[i]?.src) return steps[i].src;
    }
    return '';
  }, [steps, boundedStepIndex]);

  const handleMessage = useCallback((message: DisplayChannelMessage) => {
    if (message.type === 'SYNC') {
      setSteps(message.steps);
      setStepIndex(message.stepIndex);
      setIsReady(true);
      return;
    }

    if (message.type === 'STEP') {
      setStepIndex(message.stepIndex);
      return;
    }

    if (message.type === 'PLAY') {
      void videoRef.current?.play();
    }
  }, []);

  const { send } = useDisplayChannel(displayId, handleMessage);

  useEffect(() => {
    send({ type: 'READY' });
    if (isReady) return;

    const interval = window.setInterval(() => {
      send({ type: 'READY' });
    }, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [isReady, send]);

  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (isReady) {
        event.preventDefault();
      }
      send({ type: 'CLOSING' });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isReady, send]);

  useEffect(() => {
    send({ type: 'ACK', stepIndex: boundedStepIndex });
  }, [boundedStepIndex, send]);

  useEffect(() => {
    if (!isReady || activeStep?.kind !== 'video') return;

    const interval = window.setInterval(() => {
      const video = videoRef.current;
      if (!video) return;
      send({
        type: 'TIME',
        stepIndex: boundedStepIndex,
        currentTime: video.currentTime,
        paused: video.paused,
      });
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeStep?.kind, boundedStepIndex, isReady, send]);

  if (!isReady) {
    return (
      <Container>
        <Status>Allow new window creation</Status>
      </Container>
    );
  }

  if (!activeStep) {
    return (
      <Container>
        <Status>No timeline steps</Status>
      </Container>
    );
  }

  return (
    <Container>
      <Stage>
        {lastVideoSrc && (
          <VideoStep
            ref={videoRef}
            playsInline
            src={lastVideoSrc}
            hidden={activeStep.kind !== 'video'}
          />
        )}
        {activeStep.kind !== 'video' && <ImageStep src={activeStep.src} alt='Display step' />}
      </Stage>
    </Container>
  );
};
