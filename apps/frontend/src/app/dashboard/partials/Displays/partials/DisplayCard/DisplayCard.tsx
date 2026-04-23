import { DisplayStatus } from '@/lib/stores/display.store';
import { Button, Icon } from '@/ui';

import {
  Card,
  Counter,
  Header,
  Name,
  Preview,
  PreviewImage,
  PreviewPlaceholder,
  StatusDot,
  StatusRow,
  StatusText,
} from './styled';

interface DisplayCardProps {
  name: string;
  status: DisplayStatus;
  currentSrc: string | null;
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
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
  currentSrc,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}: DisplayCardProps) => {
  const disabled = status !== 'connected';
  const safeTotal = Math.max(totalSteps, 0);
  const safeCurrent = safeTotal === 0 ? 0 : Math.max(currentStep, 0) + 1;

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
        {currentSrc ? <PreviewImage src={currentSrc} alt={name} /> : <PreviewPlaceholder />}
      </Preview>

      {status === 'blocked' && <StatusText>Allow pop-ups in browser</StatusText>}

      <Counter>
        {safeCurrent} / {safeTotal}
      </Counter>

      <Header>
        <Button variant='icon' onClick={onPrev} disabled={disabled || currentStep <= 0}>
          <Icon name='chevron-back' size={16} />
        </Button>
        <Button
          variant='icon'
          onClick={onNext}
          disabled={disabled || safeTotal === 0 || currentStep >= Math.max(totalSteps - 1, 0)}
        >
          <Icon name='chevron-forward' size={16} />
        </Button>
      </Header>
    </Card>
  );
};
