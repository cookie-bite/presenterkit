import { create } from 'zustand';

export type DisplayStatus = 'pending' | 'blocked' | 'connected' | 'disconnected';

export interface DisplayEntry {
  id: string;
  name: string;
  status: DisplayStatus;
  stepIndex: number;
  windowRef: Window | null;
}

interface DisplayStore {
  displays: DisplayEntry[];
  upsertDisplay: (display: DisplayEntry) => void;
  setDisplayStatus: (id: string, status: DisplayStatus) => void;
  setDisplayStep: (id: string, stepIndex: number) => void;
  setWindowRef: (id: string, windowRef: Window | null) => void;
  removeDisplay: (id: string) => void;
}

export const useDisplayStore = create<DisplayStore>(set => ({
  displays: [],

  upsertDisplay: display =>
    set(state => {
      const index = state.displays.findIndex(item => item.id === display.id);
      if (index >= 0) {
        const next = [...state.displays];
        next[index] = display;
        return { displays: next };
      }
      return { displays: [display] };
    }),

  setDisplayStatus: (id, status) =>
    set(state => ({
      displays: state.displays.map(display =>
        display.id === id ? { ...display, status } : display,
      ),
    })),

  setDisplayStep: (id, stepIndex) =>
    set(state => ({
      displays: state.displays.map(display =>
        display.id === id ? { ...display, stepIndex } : display,
      ),
    })),

  setWindowRef: (id, windowRef) =>
    set(state => ({
      displays: state.displays.map(display =>
        display.id === id ? { ...display, windowRef } : display,
      ),
    })),

  removeDisplay: id =>
    set(state => ({
      displays: state.displays.filter(display => display.id !== id),
    })),
}));
