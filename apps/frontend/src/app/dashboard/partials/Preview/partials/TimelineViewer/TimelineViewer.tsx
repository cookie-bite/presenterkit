'use client';

import { useEffect, useMemo, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { usePreviewStore } from '@/lib/stores/preview.store';
import { TimelineClip } from '@/lib/stores/timeline.store';
import { Button, Icon } from '@/ui';

import { Stage } from '../../styled';
import { Container, Controls, Counter, ImageStep, VideoStep } from './styled';

type StepKind = 'image' | 'video' | 'slide';

interface TimelineViewerProps {
  clips: TimelineClip[];
  files: FileResponse[];
  selectedInstanceId: string;
}

interface TimelineStep {
  key: string;
  kind: StepKind;
  instanceId: string;
  file: FileResponse;
  page: number | null;
  pageCount: number;
  src: string;
}

function getViewerType(file: FileResponse): StepKind {
  const mime = file.mimeType ?? '';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'slide';
}

function getPageImageUrl(thumbnailUrl: string, page: number): string {
  const padded = String(page).padStart(3, '0');
  return thumbnailUrl.replace(/\d{3}\.webp$/, `${padded}.webp`);
}

export const TimelineViewer = ({ clips, files, selectedInstanceId }: TimelineViewerProps) => {
  const { setSelectedFile } = usePreviewStore();

  const steps = useMemo<TimelineStep[]>(() => {
    const fileMap = new Map(files.map(file => [file.fileId, file]));

    return clips.flatMap((clip): TimelineStep[] => {
      const file = fileMap.get(clip.fileId);
      if (!file) return [];

      const kind = getViewerType(file);

      if (kind === 'slide') {
        const pageCount = Math.max(file.pageCount ?? 1, 1);
        const thumbnailUrl = file.thumbnailUrl ?? '';

        return Array.from({ length: pageCount }, (_, i) => {
          const page = i + 1;
          return {
            key: `${clip.instanceId}-${page}`,
            kind,
            instanceId: clip.instanceId,
            file,
            page,
            pageCount,
            src: getPageImageUrl(thumbnailUrl, page),
          };
        });
      }

      return [
        {
          key: `${clip.instanceId}-1`,
          kind,
          instanceId: clip.instanceId,
          file,
          page: null,
          pageCount: 1,
          src: file.blobUrl ?? '',
        },
      ];
    });
  }, [clips, files]);

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
