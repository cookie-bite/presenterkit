import { DEFAULT_EVENT_ID } from '../constants';
import { apiClient } from './client';
import type { ErrorResponse } from './types';

export interface TimelineClip {
  instanceId: string;
  fileId: number;
}

export interface TimelineResponse {
  clips: TimelineClip[];
  updatedAt: string;
}

export interface UpdateTimelineRequest {
  clips: TimelineClip[];
}

export async function getTimeline(): Promise<TimelineResponse | ErrorResponse> {
  return apiClient
    .get(`events/${DEFAULT_EVENT_ID}/timeline`)
    .json<TimelineResponse | ErrorResponse>();
}

export async function updateTimeline(
  clips: TimelineClip[],
): Promise<TimelineResponse | ErrorResponse> {
  return apiClient
    .put(`events/${DEFAULT_EVENT_ID}/timeline`, {
      json: { clips } satisfies UpdateTimelineRequest,
    })
    .json<TimelineResponse | ErrorResponse>();
}
