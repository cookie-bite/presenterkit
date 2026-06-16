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

export function buildTimelineSteps(clips: TimelineClip[], files: FileResponse[]): TimelineStep[] {
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
}
