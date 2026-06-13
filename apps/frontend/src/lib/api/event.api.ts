import { DEFAULT_EVENT_ID } from '../constants';
import { apiClient } from './client';
import type { ErrorResponse } from './types';

export interface EventResponse {
  eventID: string;
  name: string;
  isDefault: boolean;
  uploadToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getEvent(): Promise<EventResponse | ErrorResponse> {
  return apiClient.get(`events/${DEFAULT_EVENT_ID}`).json<EventResponse | ErrorResponse>();
}
