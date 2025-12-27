'use client';

import { useId } from 'react';

import { SegmentBackground, SegmentButton, SegmentsContainer } from './Segment.styled';
import type { SegmentProps } from './Segment.types';

export function Segment({ segments, labels, value, onChange }: SegmentProps) {
  const layoutId = useId();
  const currentIndex = segments.indexOf(value);

  const handleSegmentClick = (segmentValue: string) => {
    onChange(segmentValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent, segmentValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(segmentValue);
    } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
      event.preventDefault();
      onChange(segments[currentIndex - 1]);
    } else if (event.key === 'ArrowRight' && currentIndex < segments.length - 1) {
      event.preventDefault();
      onChange(segments[currentIndex + 1]);
    }
  };

  return (
    <SegmentsContainer role='tablist' aria-label='Segment selector'>
      {labels.map((label, index) => {
        const segmentValue = segments[index];
        const isSelected = segmentValue === value;

        return (
          <SegmentButton
            key={segmentValue}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`segment-${segmentValue}`}
            id={`segment-${segmentValue}`}
            onClick={() => handleSegmentClick(segmentValue)}
            onKeyDown={e => handleKeyDown(e, segmentValue)}
            type='button'
          >
            {isSelected && <SegmentBackground layoutId={layoutId} />}
            {label}
          </SegmentButton>
        );
      })}
    </SegmentsContainer>
  );
}
