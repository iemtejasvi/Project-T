// Cache version - increment this when deploying updates
const CACHE_VERSION = 'v1.2';
const CACHE_NAME = `ifonlyisentthis-${CACHE_VERSION}`;

// Only cache static assets. Do NOT pre-cache HTML/pages to avoid serving stale UI.
const urlsToCache = [
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/opengraph-image.png'
];

// Add timestamp to force cache refresh on updates
const CACHE_TIMESTAMP = Date.now();

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Add timestamp to URLs to force refresh
        const urlsWithTimestamp = urlsToCache.map(url => 
          `${url}?v=${CACHE_VERSION}&t=${CACHE_TIMESTAMP}`
        );
        return cache.addAll(urlsWithTimestamp);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Bypass non-GET, API, and Supabase requests entirely
  if (req.method !== 'GET' || req.url.includes('/api/') || req.url.includes('supabase')) {
    return;
  }

  // Only handle http(s) schemes
  if (!req.url.startsWith('http')) {
    return;
  }

  // Only handle same-origin for caching; let third-party requests pass through
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  const acceptHeader = req.headers.get('accept') || '';
  const isDocumentRequest = req.mode === 'navigate' || acceptHeader.includes('text/html');

  // For navigations/HTML documents: always go to network first to respect latest middleware/maintenance
  if (isDocumentRequest) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // For static assets: cache-first with network fallback and background fill
  const staticDestinations = new Set(['script', 'style', 'image', 'font']);
  const isStaticAsset = staticDestinations.has(req.destination) || req.url.includes('/_next/static/');

  if (!isStaticAsset || !sameOrigin) {
    // For anything else, just fetch from network
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(req).then(cached => {
        if (cached) {
          // Update cache in background
          fetch(req).then(response => {
            if (response && response.status === 200) {
              const vary = (response.headers.get('vary') || '').toLowerCase();
              if (!vary.includes('*')) {
                cache.put(req, response.clone()).catch(() => {});
              }
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then(response => {
          if (response && response.status === 200) {
            const vary = (response.headers.get('vary') || '').toLowerCase();
            if (!vary.includes('*')) {
              cache.put(req, response.clone()).catch(() => {});
            }
          }
          return response;
        }).catch(() => cached || Response.error());
      })
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // 1) Remove old cache buckets
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => name !== CACHE_NAME ? caches.delete(name) : Promise.resolve())
      );

      // 2) Purge any cached HTML/documents from current cache (in case of earlier versions)
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();
      await Promise.all(requests.map(req => {
        const accept = req.headers.get('accept') || '';
        if (req.mode === 'navigate' || accept.includes('text/html')) {
          return cache.delete(req);
        }
        return Promise.resolve(false);
      }));

      // 3) Take control immediately
      await self.clients.claim();
    })()
  );
}); 