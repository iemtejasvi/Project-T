// Safe cleanup service worker for ifonlyisentthis.com
// Purpose: ensure no caching or SW interception persists for this site

self.addEventListener('install', event => {
  // Activate immediately
  self.skipWaiting();
});

// No fetch handler: do not intercept any requests

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      // Delete all CacheStorage entries for this origin
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    } catch (e) {
      // noop
    }

    try {
      // Unregister this service worker so it won't control pages anymore
      await self.registration.unregister();
      // Optionally take control of uncontrolled clients during cleanup
      await self.clients.claim();
    } catch (e) {
      // noop
    }
  })());
});


