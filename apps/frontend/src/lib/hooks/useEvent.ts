'use client';

import { useQuery } from '@tanstack/react-query';

import { type EventResponse, getEvent } from '@/lib/api/event.api';
import { DEFAULT_EVENT_ID } from '@/lib/constants';

export function useEvent() {
  const { data: event = null, isLoading } = useQuery<EventResponse | null>({
    queryKey: ['event', DEFAULT_EVENT_ID],
    queryFn: async () => {
      const result = await getEvent();
      if (!result || 'error' in result) return null;
      return result as EventResponse;
    },
  });

  return { event, isLoading };
}
