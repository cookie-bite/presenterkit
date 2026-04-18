'use client';

import { useEffect, useRef, useState } from 'react';

import { getValidAccessToken } from '@/lib/api/client';
import { DEFAULT_EVENT_ID } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FileEvent {
  status: string;
}

export type FileEventType = 'FILE_UPLOADED' | 'FILE_READY' | 'FILE_FAILED';

export interface FileEventCallback {
  (event: FileEvent): void;
}

/**
 * Create and manage SSE connection for file status updates
 */
export function useFileSSE(
  onFileUploaded?: FileEventCallback,
  onFileReady?: FileEventCallback,
  onFileFailed?: FileEventCallback,
) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const callbacksRef = useRef({
    onFileUploaded,
    onFileReady,
    onFileFailed,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Update callbacks ref when they change (without triggering re-render)
  useEffect(() => {
    callbacksRef.current = {
      onFileUploaded,
      onFileReady,
      onFileFailed,
    };
  }, [onFileUploaded, onFileReady, onFileFailed]);

  useEffect(() => {
    let cancelled = false;

    const connect = (token: string) => {
      if (cancelled) return;
      const eventSource = new EventSource(
        `${API_URL}/events/${DEFAULT_EVENT_ID}/files/stream/events?token=${token}`,
      );
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onerror = err => {
        if (eventSource.readyState === EventSource.CLOSED) {
          setIsConnected(false);
          setError(new Error('SSE connection closed'));
        }
      };

      eventSource.addEventListener('FILE_UPLOADED', event => {
        try {
          const data = JSON.parse(event.data) as FileEvent;
          callbacksRef.current.onFileUploaded?.(data);
        } catch (err) {
          console.error('Error parsing FILE_UPLOADED event:', err);
        }
      });

      eventSource.addEventListener('FILE_READY', event => {
        try {
          const data = JSON.parse(event.data) as FileEvent;
          callbacksRef.current.onFileReady?.(data);
        } catch (err) {
          console.error('Error parsing FILE_READY event:', err);
        }
      });

      eventSource.addEventListener('FILE_FAILED', event => {
        try {
          const data = JSON.parse(event.data) as FileEvent;
          callbacksRef.current.onFileFailed?.(data);
        } catch (err) {
          console.error('Error parsing FILE_FAILED event:', err);
        }
      });
    };

    getValidAccessToken()
      .then(token => {
        if (token) {
          connect(token);
        }
      })
      .catch(err => console.error('Could not obtain access token for SSE connection.', err));

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, []); // Empty dependency array - connection is created once

  return {
    isConnected,
    error,
    close: () => {
      eventSourceRef.current?.close();
      setIsConnected(false);
    },
  };
}
