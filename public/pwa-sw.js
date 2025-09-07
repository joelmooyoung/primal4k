const CACHE_NAME = 'primal4k-mobile-cache-v1';
const urlsToCache = [
  '/pwa.html',
  '/pwa-manifest.json',
  '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png'
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
    icon: data.icon || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    image: data.image,
    badge: data.badge || '/lovable-uploads/3896f961-2f23-4243-86dc-f164bdc87c87.png',
    data: { url: data.url || '/pwa.html' }
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