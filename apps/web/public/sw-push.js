// Service Worker for Web Push Notifications

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    // Check if this is a declarative push notification
    // If it has web_push field, it will be handled by the browser automatically
    if (data.web_push) {
      // Skip manual notification display for declarative push
      return;
    }

    // Handle service worker push notification
    const title = data.title || 'Mini Dice';
    const options = {
      body: data.body || '새로운 알림이 있습니다',
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: {
        url: data.url || '/notification-center',
      },
      tag: 'mini-dice-notification',
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/notification-center';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Install and activate events for service worker lifecycle
self.addEventListener('install', (event) => {
  console.log('Push notification service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Push notification service worker activated');
  event.waitUntil(clients.claim());
});
