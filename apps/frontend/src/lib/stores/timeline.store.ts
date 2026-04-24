import { create } from 'zustand';

export interface TimelineClip {
  instanceId: string;
  fileId: number;
}

interface TimelineStore {
  clips: TimelineClip[];
  selectedInstanceId: string | null;
  setClips: (clips: TimelineClip[]) => void;
  addClip: (fileId: number) => void;
  removeClip: (instanceId: string) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;
  selectClip: (instanceId: string | null) => void;
}

export const useTimelineStore = create<TimelineStore>(set => ({
  clips: [],
  selectedInstanceId: null,

  setClips: clips =>
    set(state => ({
      clips,
      selectedInstanceId: clips.some(c => c.instanceId === state.selectedInstanceId)
        ? state.selectedInstanceId
        : null,
    })),

  addClip: fileId =>
    set(state => ({
      clips: [...state.clips, { instanceId: crypto.randomUUID(), fileId }],
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

  selectClip: instanceId => set({ selectedInstanceId: instanceId }),
}));
