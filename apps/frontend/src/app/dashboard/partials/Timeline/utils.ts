// Must match Track's CSS padding and gap values.
export const TRACK_PADDING_PX = 8;
export const CLIP_GAP_PX = 8;

const TICK_INTERVALS = [1, 5, 10, 15, 30, 60, 120, 300] as const;
const MIN_TICK_SPACING_PX = 60;

/**
 * Converts a pure time value (seconds) to a pixel offset within the timeline,
 * accounting for the fixed-pixel gaps between main-track clips so the audio
 * track stays aligned at every zoom level.
 */
export function timeToPixel(time: number, clips: Array<{ duration: number }>, pps: number): number {
  let gapCount = 0;
  let cumTime = 0;
  for (const clip of clips) {
    if (cumTime >= time) break;
    cumTime += clip.duration;
    if (cumTime <= time) gapCount++;
  }
  return TRACK_PADDING_PX + time * pps + gapCount * CLIP_GAP_PX;
}

export function timeToRulerPixel(
  time: number,
  clips: Array<{ duration: number }>,
  pps: number,
): number {
  if (clips.length === 0) {
    return TRACK_PADDING_PX + time * pps;
  }

  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
  if (time <= totalDuration) {
    return timeToPixel(time, clips, pps);
  }

  return timeToPixel(totalDuration, clips, pps) + (time - totalDuration) * pps;
}

export function getMainTrackLayoutWidth(clips: Array<{ duration: number }>, pps: number): number {
  if (clips.length === 0) return 0;
  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
  return timeToPixel(totalDuration, clips, pps) + TRACK_PADDING_PX;
}

export function formatRulerTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function getMajorTickInterval(pps: number): number {
  return (
    TICK_INTERVALS.find(interval => interval * pps >= MIN_TICK_SPACING_PX) ??
    TICK_INTERVALS[TICK_INTERVALS.length - 1]
  );
}
