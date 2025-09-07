const CACHE_NAME = 'primal4k-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
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

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
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
    body: data.body || 'A live show is now on air!',
    icon: data.icon || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    image: data.image,
    badge: data.badge || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    tag: 'primal4k-notification'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Primal4K Live!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});