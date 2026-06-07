import { RefObject, useEffect, useRef } from 'react';

import { DisplayStatus } from '@/lib/stores/display.store';
import { StepKind } from '@/lib/utils/timeline';
import { Button, Icon } from '@/ui';

import {
  Card,
  ClickerAssignButton,
  Controls,
  ControlsRow,
  Counter,
  Header,
  Name,
  NavControlsRow,
  Preview,
  PreviewImage,
  PreviewPlaceholder,
  PreviewVideo,
  StatusDot,
  StatusRow,
  StatusText,
} from './styled';

interface DisplayCardProps {
  name: string;
  status: DisplayStatus;
  currentKind: StepKind | null;
  currentSrc: string | null;
  currentStep: number;
  totalSteps: number;
  playbackTimeRef: RefObject<number | null>;
  playbackPausedRef: RefObject<boolean>;
  currentStepIndex: number;
  isClickerAssigned: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleClicker: () => void;
}

function getStatusLabel(status: DisplayStatus) {
  if (status === 'blocked') return 'Blocked';
  if (status === 'connected') return 'Connected';
  if (status === 'pending') return 'Waiting';
  return 'Disconnected';
}

export const DisplayCard = ({
  name,
  status,
  currentKind,
  currentSrc,
  currentStep,
  totalSteps,
  playbackTimeRef,
  playbackPausedRef,
  currentStepIndex,
  isClickerAssigned,
  onPrev,
  onNext,
  onToggleClicker,
}: DisplayCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastStepIndexRef = useRef<number>(currentStepIndex);
  const disabled = status !== 'connected';
  const safeTotal = Math.max(totalSteps, 0);
  const safeCurrent = safeTotal === 0 ? 0 : Math.max(currentStep, 0) + 1;

  useEffect(() => {
    if (currentKind !== 'video') return;

    const interval = window.setInterval(() => {
      const video = videoRef.current;
      const target = playbackTimeRef.current;
      if (!video || target == null || document.visibilityState !== 'visible') return;

      if (lastStepIndexRef.current !== currentStepIndex) {
        lastStepIndexRef.current = currentStepIndex;
        playbackTimeRef.current = null;
        return;
      }

      if (Math.abs(video.currentTime - target) > 0.3) {
        video.currentTime = target;
      }
      if (playbackPausedRef.current) {
        if (!video.paused) video.pause();
      } else {
        if (video.paused) void video.play();
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [currentKind, currentStepIndex, playbackPausedRef, playbackTimeRef]);

  return (
    <Card>
      <Header>
        <Name>{name}</Name>
        <StatusRow>
          <StatusDot $status={status} />
          <StatusText>{getStatusLabel(status)}</StatusText>
        </StatusRow>
      </Header>

      <Preview>
        {currentSrc ? (
          currentKind === 'video' ? (
            <PreviewVideo ref={videoRef} src={currentSrc} muted playsInline />
          ) : (
            <PreviewImage src={currentSrc} alt={name} />
          )
        ) : (
          <PreviewPlaceholder />
        )}
      </Preview>

      {status === 'blocked' && <StatusText>Allow pop-ups in browser</StatusText>}

      <Controls>
        <ControlsRow>
          <ClickerAssignButton
            variant='icon'
            $active={isClickerAssigned}
            onClick={onToggleClicker}
            disabled={disabled}
            title={isClickerAssigned ? 'Unassign clicker' : 'Assign clicker'}
          >
            <Icon name='radio-outline' size={16} />
          </ClickerAssignButton>
        </ControlsRow>
        <NavControlsRow>
          <Button variant='icon' onClick={onPrev} disabled={disabled || currentStep <= 0}>
            <Icon name='chevron-back' size={16} />
          </Button>
          <Counter>
            {safeCurrent} / {safeTotal}
          </Counter>
          <Button
            variant='icon'
            onClick={onNext}
            disabled={
              disabled ||
              safeTotal === 0 ||
              (currentStep >= Math.max(totalSteps - 1, 0) && currentKind !== 'video')
            }
          >
            <Icon name='chevron-forward' size={16} />
          </Button>
        </NavControlsRow>
      </Controls>
    </Card>
  );
};
