'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { TimelineClip } from '@/lib/stores/timeline.store';

type DisplayReadyMessage = { type: 'READY' };
type DisplayClosingMessage = { type: 'CLOSING' };
type DisplayAckMessage = { type: 'ACK'; stepIndex: number };

type DisplaySyncMessage = {
  type: 'SYNC';
  clips: TimelineClip[];
  files: FileResponse[];
  stepIndex: number;
};
type DisplayStepMessage = { type: 'STEP'; stepIndex: number };

export type DisplayInboundMessage = DisplayReadyMessage | DisplayClosingMessage | DisplayAckMessage;
export type DisplayOutboundMessage = DisplaySyncMessage | DisplayStepMessage;
export type DisplayChannelMessage = DisplayInboundMessage | DisplayOutboundMessage;

export function useDisplayChannel(
  displayId: string | null,
  onMessage?: (message: DisplayChannelMessage) => void,
) {
  const callbackRef = useRef(onMessage);

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  const channelName = useMemo(() => {
    if (!displayId) return null;
    return `display-${displayId}`;
  }, [displayId]);

  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!channelName || typeof window === 'undefined') return;

    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    channel.onmessage = event => {
      callbackRef.current?.(event.data as DisplayChannelMessage);
    };

    return () => {
      channel.close();
      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, [channelName]);

  const send = useCallback((message: DisplayChannelMessage) => {
    channelRef.current?.postMessage(message);
  }, []);

  return { send };
}
