const CACHE_NAME = 'primal4k-mobile-v1';
const urlsToCache = [
  '/mobile.html',
  '/mobile-manifest.json',
  '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with network-first strategy for live content
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network request is successful, update cache and return response
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Primal4K Live!', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'A live DJ set is now streaming!',
    icon: data.icon || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    image: data.image,
    badge: data.badge || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    data: { url: data.url || '/mobile.html' },
    vibrate: [200, 100, 200],
    tag: 'primal4k-mobile-notification',
    actions: [
      {
        action: 'open',
        title: 'Listen Now',
        icon: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Primal4K Mobile Live!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if mobile app is already open
        for (const client of clientList) {
          if (client.url.includes('/mobile.html') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open mobile app if not open
        if (clients.openWindow) {
          return clients.openWindow('/mobile.html');
        }
      })
    );
  }
});