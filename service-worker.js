// Image Optimization Service Worker

const CACHE_NAME = 'optimized-images-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Resources to precache
const PRECACHE_URLS = [];

// Install event - cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback strategy for images
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Only handle image requests
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache => {
        return fetch(event.request.clone())
          .then(response => {
            // If we got a valid response, cache it
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network request fails, try to get it from cache
            return cache.match(event.request);
          });
      })
    );
  }
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_IMAGE') {
    // Cache specific image URL sent from client
    const imageUrl = event.data.url;
    if (imageUrl) {
      caches.open(RUNTIME_CACHE).then(cache => {
        fetch(imageUrl, { mode: 'no-cors' })
          .then(response => cache.put(imageUrl, response))
          .catch(err => console.error('Failed to cache image:', err));
      });
    }
  } else if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});