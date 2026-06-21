'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TimelineClip } from '@/lib/stores/timeline.store';

import {
  formatRulerTime,
  getMainTrackLayoutWidth,
  getMajorTickInterval,
  timeToPixel,
  timeToRulerPixel,
  TRACK_PADDING_PX,
} from '../../layout';
import { RulerSizer, RulerTrack, Tick, TickLabel, TickMark } from './styled';

interface RulerProps {
  clips: TimelineClip[];
  pixelsPerSecond: number;
}

export function Ruler({ clips, pixelsPerSecond }: RulerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const hasClips = clips.length > 0;

  const contentWidth = useMemo(
    () => getMainTrackLayoutWidth(clips, pixelsPerSecond),
    [clips, pixelsPerSecond],
  );

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) setMeasuredWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setMeasuredWidth(element.getBoundingClientRect().width);

    return () => {
      observer.disconnect();
    };
  }, [hasClips, contentWidth, pixelsPerSecond]);

  const totalDuration = useMemo(() => {
    const contentDuration = hasClips ? clips.reduce((sum, clip) => sum + clip.duration, 0) : 0;

    const linearDuration = Math.max(measuredWidth - TRACK_PADDING_PX * 2, 0) / pixelsPerSecond;

    if (!hasClips) return linearDuration;

    const contentEndPx = timeToPixel(contentDuration, clips, pixelsPerSecond);
    if (measuredWidth <= contentEndPx + TRACK_PADDING_PX) return contentDuration;

    return contentDuration + (measuredWidth - contentEndPx - TRACK_PADDING_PX) / pixelsPerSecond;
  }, [clips, hasClips, measuredWidth, pixelsPerSecond]);

  const tickTimes = useMemo(() => {
    if (totalDuration <= 0) return [];

    const interval = getMajorTickInterval(pixelsPerSecond);
    const times: number[] = [];
    for (let time = 0; time <= totalDuration; time += interval) {
      times.push(time);
    }
    return times;
  }, [pixelsPerSecond, totalDuration]);

  return (
    <RulerTrack ref={trackRef}>
      <RulerSizer $width={hasClips ? contentWidth : 0} />
      {tickTimes.map(time => (
        <Tick key={time} $left={timeToRulerPixel(time, clips, pixelsPerSecond)}>
          <TickMark />
          <TickLabel>{formatRulerTime(time)}</TickLabel>
        </Tick>
      ))}
    </RulerTrack>
  );
}
