const CACHE_NAME = 'primal4k-mobile-cache-v1';
const urlsToCache = [
  '/mobile.html',
  '/manifest.json',
  '/mobile.primal4k.com/icons/icon-192x192.png',
  '/mobile.primal4k.com/icons/icon-512x512.png'
];

self.addEventListener('install', event =>
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)))
);

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event =>
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)))
);

self.addEventListener('push', event => {
  let data = {};
  if (event.data) data = event.data.json();

  const options = {
    body: data.body || 'A live show is now on air!',
    icon: data.icon || '/icons/icon-192x192.png',
    image: data.image,
    badge: data.badge || '/icons/icon-192x192.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Primal4k Live!', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(clientList => {
    for (const client of clientList) {
      if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(event.notification.data.url);
  }));
});