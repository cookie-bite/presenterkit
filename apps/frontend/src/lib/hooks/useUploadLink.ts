'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createLink, getUploadPage, type UploadPageResponse } from '@/lib/api/upload-link.api';

export function useCreateLink(eventID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createLink(eventID),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event', eventID] });
    },
  });
}

export function useUploadPage(token: string | null) {
  return useQuery<UploadPageResponse>({
    queryKey: ['upload-page', token],
    queryFn: () => getUploadPage(token!),
    enabled: !!token,
    retry: false,
  });
}
