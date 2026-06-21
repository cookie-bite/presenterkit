import { FileResponse } from '@/lib/api/file.api';
import { TimelineClip } from '@/lib/stores/timeline.store';

export type StepKind = 'image' | 'video' | 'slide' | 'audio';

export const isAudioFile = (file: FileResponse): boolean =>
  file.mimeType?.startsWith('audio/') ?? false;

export const isVideoFile = (file: FileResponse): boolean =>
  file.mimeType?.startsWith('video/') ?? false;

export const DEFAULT_IMAGE_DURATION_S = 12;
export const DEFAULT_SLIDE_DURATION_PER_PAGE_S = 12;

export interface TimelineStep {
  key: string;
  kind: StepKind;
  instanceId: string;
  file: FileResponse;
  page: number | null;
  pageCount: number;
  src: string;
  audioSrc: string | null;
}

export function getDefaultDuration(file: FileResponse): number {
  const mime = file.mimeType ?? '';
  if (mime.startsWith('audio/') || mime.startsWith('video/'))
    return file.duration ?? DEFAULT_IMAGE_DURATION_S;
  if (mime.startsWith('image/')) return DEFAULT_IMAGE_DURATION_S;
  return (file.pageCount ?? 1) * DEFAULT_SLIDE_DURATION_PER_PAGE_S;
}

function getViewerType(file: FileResponse): StepKind {
  const mime = file.mimeType ?? '';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'slide';
}

function getPageImageUrl(thumbnailUrl: string, page: number): string {
  const padded = String(page).padStart(3, '0');
  return thumbnailUrl.replace(/\d{3}\.webp$/, `${padded}.webp`);
}

export function buildTimelineSteps(
  clips: TimelineClip[],
  files: FileResponse[],
  audioClips: TimelineClip[] = [],
): TimelineStep[] {
  const fileMap = new Map(files.map(file => [file.fileId, file]));
  const steps: TimelineStep[] = [];
  let cumulativeTime = 0;

  for (const clip of clips) {
    const file = fileMap.get(clip.fileId);
    if (!file) {
      cumulativeTime += clip.duration;
      continue;
    }

    const kind = getViewerType(file);

    if (kind === 'slide') {
      const pageCount = Math.max(file.pageCount ?? 1, 1);
      const pageDuration = clip.duration / pageCount;
      const thumbnailUrl = file.thumbnailUrl ?? '';

      for (let i = 0; i < pageCount; i++) {
        const stepStart = cumulativeTime + i * pageDuration;
        steps.push({
          key: `${clip.instanceId}-${i + 1}`,
          kind,
          instanceId: clip.instanceId,
          file,
          page: i + 1,
          pageCount,
          src: getPageImageUrl(thumbnailUrl, i + 1),
          audioSrc: findAudioSrc(audioClips, fileMap, stepStart, pageDuration),
        });
      }
    } else {
      steps.push({
        key: `${clip.instanceId}-1`,
        kind,
        instanceId: clip.instanceId,
        file,
        page: null,
        pageCount: 1,
        src: file.blobUrl ?? '',
        audioSrc: findAudioSrc(audioClips, fileMap, cumulativeTime, clip.duration),
      });
    }

    cumulativeTime += clip.duration;
  }

  return steps;
}

function findAudioSrc(
  audioClips: TimelineClip[],
  fileMap: Map<number, FileResponse>,
  stepStart: number,
  stepDuration: number,
): string | null {
  const match = audioClips.find(ac => {
    const t = ac.startTime ?? 0;
    return t >= stepStart && t < stepStart + stepDuration;
  });
  return match ? (fileMap.get(match.fileId)?.blobUrl ?? null) : null;
}
