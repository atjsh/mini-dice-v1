// Service Worker for Web Push Notifications

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    // Check if this is a declarative push notification (RFC 8030 format)
    // If it has web_push field with value 8030, it may be handled automatically by the browser
    if (data.web_push === 8030 && data.notification) {
      // For browsers that support declarative push, the notification is displayed automatically
      // For browsers that don't, we need to display it manually
      // Since we can't reliably detect support, we'll display it for non-Safari browsers
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isSafari) {
        // Safari likely handles this automatically, skip manual display
        return;
      }
      
      // For other browsers, display the notification manually
      const notification = data.notification;
      const title = notification.title || 'Mini Dice';
      const options = {
        body: notification.body || '새로운 알림이 있습니다',
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: {
          url: notification.navigate || '/notifications',
        },
        tag: 'mini-dice-notification',
        requireInteraction: false,
      };

      event.waitUntil(self.registration.showNotification(title, options));
      return;
    }

    // Fallback for any other format (shouldn't happen with our implementation)
    console.warn('Received push notification in unexpected format:', data);
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/notifications';

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
