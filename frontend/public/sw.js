const CACHE_NAME = 'silentsos-assets-v1';
const DATA_CACHE_NAME = 'silentsos-data-v1';

// Assets to cache immediately on install
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Delete any cache that isn't the current version
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Special handling for Emergency Profile API calls
  if (event.request.url.includes('/api/emergency/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // If we have internet, update the cache with the latest patient data
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If offline, return the cached profile data
            return cache.match(event.request.url);
          });
      })
    );
    return;
  }

  // General assets: Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});