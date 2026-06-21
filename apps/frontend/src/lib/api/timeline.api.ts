import { DEFAULT_EVENT_ID } from '../constants';
import { apiClient } from './client';
import type { ErrorResponse } from './types';

export interface TimelineClip {
  instanceId: string;
  fileId: number;
  duration: number;
  startTime?: number; // audio track only — absolute position on the time axis (seconds)
}

export interface TimelineResponse {
  clips: TimelineClip[];
  audioClips: TimelineClip[];
  updatedAt: string;
}

export interface UpdateTimelineRequest {
  clips: TimelineClip[];
  audioClips: TimelineClip[];
}

export async function getTimeline(): Promise<TimelineResponse | ErrorResponse> {
  return apiClient
    .get(`events/${DEFAULT_EVENT_ID}/timeline`)
    .json<TimelineResponse | ErrorResponse>();
}

export async function updateTimeline(
  clips: TimelineClip[],
  audioClips: TimelineClip[],
): Promise<TimelineResponse | ErrorResponse> {
  return apiClient
    .put(`events/${DEFAULT_EVENT_ID}/timeline`, {
      json: { clips, audioClips } satisfies UpdateTimelineRequest,
    })
    .json<TimelineResponse | ErrorResponse>();
}
