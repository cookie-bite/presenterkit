'use client';

import { useEffect, useRef, useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';

const CACHE_NAME = 'media-v1';

function getPageUrl(thumbnailUrl: string, page: number): string {
  const padded = String(page).padStart(3, '0');
  return thumbnailUrl.replace(/\d{3}\.webp$/, `${padded}.webp`);
}

function getUrlsForFile(file: FileResponse): string[] {
  const urls: string[] = [];
  if (file.blobUrl) urls.push(file.blobUrl);
  if (file.thumbnailUrl) {
    const pageCount = file.pageCount ?? 1;
    for (let p = 1; p <= pageCount; p++) {
      urls.push(getPageUrl(file.thumbnailUrl, p));
    }
  }
  return [...new Set(urls)];
}

export interface MediaCacheProgress {
  fileDone: number | null;
  fileTotal: number | null;
  byteProgress: number | null;
}

export function useMediaCache(files: FileResponse[]): MediaCacheProgress {
  const [fileDone, setFileDone] = useState<number | null>(null);
  const [fileTotal, setFileTotal] = useState<number | null>(null);
  const [byteProgress, setByteProgress] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  useEffect(() => {
    const readyFiles = files.filter(f => f.status === 'ready');
    if (readyFiles.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    void (async () => {
      const cache = await caches.open(CACHE_NAME);
      const allUrls = readyFiles.flatMap(getUrlsForFile);

      // Evict orphaned entries
      const keys = await cache.keys();
      for (const req of keys) {
        if (!allUrls.includes(req.url)) await cache.delete(req);
      }

      // Find cache misses
      const misses: string[] = [];
      for (const url of allUrls) {
        const hit = await cache.match(url);
        if (!hit) misses.push(url);
      }

      if (misses.length === 0) return;

      // Probe Content-Length for all misses upfront
      const totalBytes = await Promise.all(
        misses.map(url =>
          fetch(`${url}?_sw_skip=1`, { method: 'HEAD', signal: controller.signal })
            .then(r => Number(r.headers.get('content-length') ?? 0))
            .catch(() => 0),
        ),
      ).then(sizes => sizes.reduce((a, b) => a + b, 0));

      let filesDone = 0;
      let bytesDone = 0;

      setFileDone(0);
      setFileTotal(misses.length);
      setByteProgress(totalBytes > 0 ? 0 : null);

      for (const url of misses) {
        if (controller.signal.aborted) break;

        try {
          const res = await fetch(`${url}?_sw_skip=1`, { signal: controller.signal });
          if (!res.ok || !res.body) {
            filesDone++;
            setFileDone(filesDone);
            continue;
          }

          const contentLength = Number(res.headers.get('content-length') ?? 0);
          const chunks: Uint8Array<ArrayBuffer>[] = [];
          const reader = res.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            bytesDone += value.byteLength;
            if (totalBytes > 0) {
              setByteProgress(Math.round((bytesDone / totalBytes) * 100));
            }
          }

          const blob = new Blob(chunks);
          await cache.put(
            url,
            new Response(blob, {
              headers: {
                'Content-Type': res.headers.get('Content-Type') ?? 'application/octet-stream',
                ...(contentLength > 0 ? { 'Content-Length': String(contentLength) } : {}),
              },
            }),
          );
        } catch {
          // abort or network error — bail silently
          if (controller.signal.aborted) break;
        }

        filesDone++;
        setFileDone(filesDone);
      }

      if (!controller.signal.aborted) {
        setFileDone(null);
        setFileTotal(null);
        setByteProgress(null);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [files]);

  return { fileDone, fileTotal, byteProgress };
}
