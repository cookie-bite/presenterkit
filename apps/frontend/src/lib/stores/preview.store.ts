import { create } from 'zustand';

import { FileResponse } from '@/lib/api/file.api';

interface PreviewStore {
  selectedFile: FileResponse | null;
  setSelectedFile: (file: FileResponse | null) => void;
}

export const usePreviewStore = create<PreviewStore>(set => ({
  selectedFile: null,
  setSelectedFile: file => set({ selectedFile: file }),
}));
