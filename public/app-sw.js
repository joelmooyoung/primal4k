const CACHE_NAME = 'primal4k-radio-v2';

// Install event
self.addEventListener('install', event => {
  console.log('✅ Primal4K Service Worker Installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('✅ Primal4K Service Worker Activated');
  self.clients.claim();
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