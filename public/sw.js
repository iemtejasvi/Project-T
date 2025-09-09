// Stable cache name; we handle freshness via network fetch and activation cleanup
const CACHE_NAME = 'ifonlyisentthis-static';

// Only pre-cache static, versioned assets that are safe to cache long-term
// Never pre-cache HTML routes to avoid serving stale pages
const urlsToCache = [
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/opengraph-image.png'
];

// Add timestamp to force cache refresh on install (used only for pre-cache URLs)
const CACHE_TIMESTAMP = Date.now();

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const urlsWithTimestamp = urlsToCache.map(url => `${url}?t=${CACHE_TIMESTAMP}`);
      return cache.addAll(urlsWithTimestamp);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Bypass non-GET requests and API calls entirely
  if (request.method !== 'GET' || request.url.includes('/api/') || request.url.includes('supabase')) {
    return;
  }

  // Never cache HTML navigations; always go to network first with cache fallback
  const acceptHeader = request.headers.get('accept') || '';
  const isHTMLNavigation = request.mode === 'navigate' || acceptHeader.includes('text/html');
  if (isHTMLNavigation) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for static assets (images/fonts/icons). Let Next.js headers manage JS/CSS.
  const isStaticAsset =
    request.destination === 'image' ||
    request.destination === 'font' ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(new URL(request.url).pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        const freshRequest = new Request(request, { cache: 'reload' });
        return fetch(freshRequest).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          }
          return response;
        });
      })
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => {
        if (name !== CACHE_NAME && name.startsWith('ifonlyisentthis')) {
          return caches.delete(name);
        }
        return undefined;
      })
    );
    await self.skipWaiting();
    await self.clients.claim();
    // Do not force navigate; registration code will handle a single reload
  })());
}); 

// Support message-triggered skipWaiting to update clients seamlessly
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});