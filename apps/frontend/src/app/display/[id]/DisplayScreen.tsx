'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { DisplayChannelMessage, useDisplayChannel } from '@/lib/hooks/useDisplayChannel';
import { TimelineClip } from '@/lib/stores/timeline.store';
import { buildTimelineSteps } from '@/lib/utils/timeline';

import { Container, ImageStep, Stage, Status, VideoStep } from './styled';

interface DisplayScreenProps {
  displayId: string;
}

export const DisplayScreen = ({ displayId }: DisplayScreenProps) => {
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const steps = useMemo(() => buildTimelineSteps(clips, files), [clips, files]);
  const boundedStepIndex = Math.min(Math.max(stepIndex, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[boundedStepIndex];

  const handleMessage = useCallback((message: DisplayChannelMessage) => {
    if (message.type === 'SYNC') {
      setClips(message.clips);
      setFiles(message.files);
      setStepIndex(message.stepIndex);
      setIsReady(true);
      return;
    }

    if (message.type === 'STEP') {
      setStepIndex(message.stepIndex);
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
    const handleUnload = () => {
      send({ type: 'CLOSING' });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [send]);

  useEffect(() => {
    send({ type: 'ACK', stepIndex: boundedStepIndex });
  }, [boundedStepIndex, send]);

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
        {activeStep.kind === 'video' ? (
          <VideoStep autoPlay playsInline src={activeStep.src} />
        ) : (
          <ImageStep src={activeStep.src} alt={activeStep.file.filename ?? 'Display step'} />
        )}
      </Stage>
    </Container>
  );
};
