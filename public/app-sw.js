const CACHE_NAME = 'primal4k-app-v1';
const urlsToCache = [
  '/app.html',
  '/app-manifest.json',
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

// Fetch event - let the main site handle most requests
self.addEventListener('fetch', event => {
  // Only cache our PWA shell files
  if (event.request.url.includes('/app.html') || 
      event.request.url.includes('/app-manifest.json') ||
      event.request.url.includes('/app-sw.js')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
  // Let all other requests (main site) pass through normally
});

// Push notification event
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Primal4K Radio Live!', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'A live show is now on air!',
    icon: data.icon || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    image: data.image,
    badge: data.badge || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    data: { url: data.url || '/app.html' },
    vibrate: [200, 100, 200],
    tag: 'primal4k-app-notification',
    actions: [
      {
        action: 'open',
        title: 'Open Primal4K',
        icon: '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Primal4K Radio Live!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/app.html') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open app if not open
        if (clients.openWindow) {
          return clients.openWindow('/app.html');
        }
      })
    );
  }
});