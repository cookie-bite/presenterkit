const CACHE_NAME = 'media-v1';
const AZURE_BLOB_URL_PATTERN = /\.blob\.core\.windows\.net\//;
const SW_CACHE_LOG = false;

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!AZURE_BLOB_URL_PATTERN.test(event.request.url)) return;
  if (new URL(event.request.url).searchParams.has('_sw_skip')) return;

  const range = event.request.headers.get('Range');

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const t0 = SW_CACHE_LOG ? performance.now() : 0;
      const cached = await cache.match(new Request(event.request.url));

      if (!cached) {
        if (SW_CACHE_LOG) console.log(`[SW] MISS  ${shortUrl(event.request.url)} range=${range ?? 'none'} (match: ${(performance.now() - t0).toFixed(1)}ms) → network`);
        return fetch(event.request);
      }

      if (!range) {
        if (SW_CACHE_LOG) console.log(`[SW] HIT   ${shortUrl(event.request.url)} no-range (match: ${(performance.now() - t0).toFixed(1)}ms)`);
        return cached;
      }

      const t1 = SW_CACHE_LOG ? performance.now() : 0;
      const res = await sliceResponse(cached, range);
      if (SW_CACHE_LOG) console.log(`[SW] HIT   ${shortUrl(event.request.url)} ${range} (match: ${(performance.now() - t0).toFixed(1)}ms, slice: ${(performance.now() - t1).toFixed(1)}ms)`);
      return res;
    }),
  );
});

function shortUrl(url) {
  return url.split('/').slice(-2).join('/');
}

async function sliceResponse(response, rangeHeader) {
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) return response;

  const buf = await response.arrayBuffer();
  const total = buf.byteLength;
  const [, startStr, endStr] = match;
  const isSuffix = startStr === '';
  const start = isSuffix ? total - parseInt(endStr, 10) : parseInt(startStr, 10);
  const end = isSuffix ? total - 1 : endStr !== '' ? parseInt(endStr, 10) : total - 1;

  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
