const CACHE_NAME = 'primal4k-radio-v1';
const urlsToCache = [
  '/',
  '/app-manifest.json',
  '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('✅ Primal4K PWA Service Worker Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ PWA Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ PWA Resources cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ PWA Install failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('✅ Primal4K PWA Service Worker Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old PWA cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ PWA Service Worker claimed clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - basic caching strategy
self.addEventListener('fetch', event => {
  // Cache essential PWA files
  if (event.request.url.includes('/app-manifest.json') ||
      event.request.url.includes('/lovable-uploads/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
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