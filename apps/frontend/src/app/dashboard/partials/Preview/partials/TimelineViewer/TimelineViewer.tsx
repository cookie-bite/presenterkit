'use client';

import { useEffect, useMemo, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { TimelineClip } from '@/lib/stores/timeline.store';
import { buildTimelineSteps, TimelineStep } from '@/lib/utils/timeline';
import { Button, Icon } from '@/ui';

import { Stage } from '../../styled';
import { Container, Controls, Counter, ImageStep, VideoStep } from './styled';

interface TimelineViewerProps {
  clips: TimelineClip[];
  files: FileResponse[];
  selectedInstanceId: string;
}

export const TimelineViewer = ({ clips, files, selectedInstanceId }: TimelineViewerProps) => {
  const { setSelectedFile } = usePreviewStore();

  const steps = useMemo<TimelineStep[]>(() => buildTimelineSteps(clips, files), [clips, files]);

  const initialStepIndex = useMemo(() => {
    const found = steps.findIndex(step => step.instanceId === selectedInstanceId);
    return found >= 0 ? found : 0;
  }, [selectedInstanceId, steps]);
  const [activeStepIndex, setActiveStepIndex] = useState(initialStepIndex);
  const boundedStepIndex = Math.min(Math.max(activeStepIndex, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[boundedStepIndex];

  useEffect(() => {
    if (activeStep) {
      setSelectedFile(activeStep.file);
    }
  }, [activeStep, setSelectedFile]);

  useEffect(() => {
    if (!activeStep) return;

    const adjacent = [steps[boundedStepIndex - 1], steps[boundedStepIndex + 1]].filter(
      Boolean,
    ) as TimelineStep[];

    adjacent.forEach(step => {
      if (step.kind === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = step.src;
        video.load();
      } else {
        const image = new Image();
        image.src = step.src;
      }
    });
  }, [activeStep, boundedStepIndex, steps]);

  if (!activeStep) return null;

  return (
    <Container>
      <Stage>
        {activeStep.kind === 'video' ? (
          <VideoStep controls autoPlay playsInline src={activeStep.src} />
        ) : (
          <ImageStep src={activeStep.src} alt={activeStep.file.filename ?? 'Timeline step'} />
        )}
      </Stage>

      <Controls>
        <Button
          variant='icon'
          onClick={() => setActiveStepIndex(prev => Math.max(prev - 1, 0))}
          disabled={boundedStepIndex === 0}
        >
          <Icon name='chevron-back' size={16} />
        </Button>
        <Counter>
          {boundedStepIndex + 1} / {steps.length}
        </Counter>
        <Button
          variant='icon'
          onClick={() => setActiveStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
          disabled={boundedStepIndex === steps.length - 1}
        >
          <Icon name='chevron-forward' size={16} />
        </Button>
      </Controls>
    </Container>
  );
};
