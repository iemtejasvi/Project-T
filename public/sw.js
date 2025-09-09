// Cache version - bump to invalidate old caches
const CACHE_VERSION = 'v2.0';
const CACHE_NAME = `ifonlyisentthis-${CACHE_VERSION}`;

// Only pre-cache immutable static assets. Never pre-cache HTML routes.
const STATIC_ASSETS = [
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/opengraph-image.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never handle non-GET or API calls
  if (request.method !== 'GET' || request.url.includes('/api/') || request.url.includes('supabase')) {
    return;
  }

  const requestUrl = new URL(request.url);

  // Use network-first for HTML/doc requests to avoid serving stale pages
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => networkResponse)
        .catch(() => {
          // Safe offline fallback HTML to avoid throwing in SW
          const offlineHtml = `<!doctype html><html><head><meta charset="utf-8"/><title>Offline</title><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding:16px;">You appear to be offline. Please reconnect and try again.</body></html>`;
          return new Response(offlineHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        })
    );
    return;
  }

  // For same-origin static assets, prefer cache-first with network fallback
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('ifonlyisentthis-')) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Notify clients when a new SW takes control so they can refresh once
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});