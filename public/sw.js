// Cache version - increment this when deploying updates
const CACHE_VERSION = 'v1.1';
const CACHE_NAME = `ifonlyisentthis-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/memories',
  '/submit',
  '/how-it-works',
  '/contact',
  '/donate',
  '/privacy-policy',
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
});

self.addEventListener('fetch', event => {
  // Skip caching for dynamic content and API calls
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Fetch from network
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response before caching
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return cached version if network fails
            return caches.match(event.request);
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for messages from the main thread to clear cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
}); 