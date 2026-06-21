import { create } from 'zustand';

export interface TimelineClip {
  instanceId: string;
  fileId: number;
  duration: number;
  startTime?: number; // audio track only — absolute position (seconds)
}

interface TimelineStore {
  clips: TimelineClip[];
  audioClips: TimelineClip[];
  committedClips: TimelineClip[];
  committedAudioClips: TimelineClip[];
  selectedInstanceId: string | null;

  setClips: (clips: TimelineClip[], audioClips: TimelineClip[]) => void;

  // main track
  addClip: (fileId: number, duration: number) => void;
  removeClip: (instanceId: string) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;

  // audio track
  addAudioClip: (fileId: number, duration: number) => void;
  removeAudioClip: (instanceId: string) => void;
  moveAudioClip: (instanceId: string, startTime: number) => void;

  // shared
  resizeClip: (instanceId: string, newDuration: number) => void;
  selectClip: (instanceId: string | null) => void;
  commitClips: () => void;
}

function findFirstAvailableStart(audioClips: TimelineClip[], duration: number): number {
  const sorted = [...audioClips].sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0));
  let start = 0;
  for (const clip of sorted) {
    const clipStart = clip.startTime ?? 0;
    if (clipStart >= start + duration) break;
    start = clipStart + clip.duration;
  }
  return start;
}

export const useTimelineStore = create<TimelineStore>(set => ({
  clips: [],
  audioClips: [],
  committedClips: [],
  committedAudioClips: [],
  selectedInstanceId: null,

  setClips: (clips, audioClips) =>
    set(state => ({
      clips,
      audioClips,
      committedClips: clips,
      committedAudioClips: audioClips,
      selectedInstanceId:
        clips.some(c => c.instanceId === state.selectedInstanceId) ||
        audioClips.some(c => c.instanceId === state.selectedInstanceId)
          ? state.selectedInstanceId
          : null,
    })),

  addClip: (fileId, duration) =>
    set(state => ({
      clips: [...state.clips, { instanceId: crypto.randomUUID(), fileId, duration }],
    })),

  removeClip: instanceId =>
    set(state => ({
      clips: state.clips.filter(c => c.instanceId !== instanceId),
      selectedInstanceId: state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
    })),

  reorderClips: (oldIndex, newIndex) =>
    set(state => {
      const clips = [...state.clips];
      const [item] = clips.splice(oldIndex, 1);
      clips.splice(newIndex, 0, item);
      return { clips };
    }),

  addAudioClip: (fileId, duration) =>
    set(state => {
      const startTime = findFirstAvailableStart(state.audioClips, duration);
      return {
        audioClips: [
          ...state.audioClips,
          { instanceId: crypto.randomUUID(), fileId, duration, startTime },
        ],
      };
    }),

  removeAudioClip: instanceId =>
    set(state => ({
      audioClips: state.audioClips.filter(c => c.instanceId !== instanceId),
      selectedInstanceId: state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
    })),

  moveAudioClip: (instanceId, startTime) =>
    set(state => ({
      audioClips: state.audioClips.map(c =>
        c.instanceId === instanceId ? { ...c, startTime } : c,
      ),
    })),

  resizeClip: (instanceId, newDuration) =>
    set(state => {
      const inMain = state.clips.some(c => c.instanceId === instanceId);
      if (inMain) {
        return {
          clips: state.clips.map(c =>
            c.instanceId === instanceId ? { ...c, duration: newDuration } : c,
          ),
        };
      }
      return {
        audioClips: state.audioClips.map(c =>
          c.instanceId === instanceId ? { ...c, duration: newDuration } : c,
        ),
      };
    }),

  selectClip: instanceId => set({ selectedInstanceId: instanceId }),

  commitClips: () =>
    set(state => ({
      committedClips: state.clips,
      committedAudioClips: state.audioClips,
    })),
}));
