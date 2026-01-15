import { authedAxios } from '../tdol-server/auth/access-token';

interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

interface SubscriptionData {
  endpoint: string;
  pushType: 'declarative' | 'service-worker';
  keys?: PushSubscriptionKeys;
  expirationTime?: number | null;
}

export class PushNotificationManager {
  private static instance: PushNotificationManager;

  private constructor() {}

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  /**
   * Check if declarative web push is supported
   */
  isDeclarativePushSupported(): boolean {
    // Declarative Web Push is supported in Safari 18.4+
    // Check for the presence of the declarative push API
    if ('PushManager' in window && 'subscribe' in PushManager.prototype) {
      const userAgent = navigator.userAgent.toLowerCase();
      // Safari 18.4+ supports declarative push
      if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get VAPID public key from server
   */
  async getVapidPublicKey(): Promise<string> {
    const response = await authedAxios.get<{ publicKey: string }>(
      '/push/vapid-public-key'
    );
    return response.data.publicKey;
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/sw-push.js',
        {
          scope: '/',
        }
      );

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Subscribe to push notifications
   * Try declarative push first, fallback to service worker push
   */
  async subscribeToPushNotifications(): Promise<{
    success: boolean;
    pushType?: 'declarative' | 'service-worker';
  }> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    // Request permission
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Try declarative push first
    if (this.isDeclarativePushSupported()) {
      try {
        const result = await this.subscribeDeclarativePush();
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn('Declarative push failed, falling back to service worker:', error);
      }
    }

    // Fallback to service worker push
    return await this.subscribeServiceWorkerPush();
  }

  /**
   * Subscribe using declarative web push
   */
  private async subscribeDeclarativePush(): Promise<{
    success: boolean;
    pushType: 'declarative';
  }> {
    // For declarative push, we use the Push API directly
    // without service worker subscription
    const vapidPublicKey = await this.getVapidPublicKey();

    // Convert VAPID key to Uint8Array
    const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

    const registration = await this.registerServiceWorker();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    const subscriptionJson = subscription.toJSON();

    // Send to server
    await authedAxios.post('/push/subscribe', {
      endpoint: subscriptionJson.endpoint,
      pushType: 'declarative',
      keys: subscriptionJson.keys,
      expirationTime: subscriptionJson.expirationTime,
    });

    return { success: true, pushType: 'declarative' };
  }

  /**
   * Subscribe using service worker push
   */
  private async subscribeServiceWorkerPush(): Promise<{
    success: boolean;
    pushType: 'service-worker';
  }> {
    const vapidPublicKey = await this.getVapidPublicKey();
    const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

    const registration = await this.registerServiceWorker();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    const subscriptionJson = subscription.toJSON();

    // Send to server
    await authedAxios.post('/push/subscribe', {
      endpoint: subscriptionJson.endpoint,
      pushType: 'service-worker',
      keys: subscriptionJson.keys,
      expirationTime: subscriptionJson.expirationTime,
    });

    return { success: true, pushType: 'service-worker' };
  }

  /**
   * Check if user is currently subscribed
   */
  async isPushSubscribed(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (!registration) {
        return false;
      }

      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPushNotifications(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (!registration) {
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const subscriptionJson = subscription.toJSON();

        // Unsubscribe locally
        await subscription.unsubscribe();

        // Notify server
        if (subscriptionJson.endpoint) {
          await authedAxios.delete('/push/unsubscribe', {
            data: {
              endpoint: subscriptionJson.endpoint,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe all subscriptions for this user
   */
  async unsubscribeAll(): Promise<void> {
    try {
      await authedAxios.delete('/push/unsubscribe-all');
    } catch (error) {
      console.error('Error unsubscribing all:', error);
      throw error;
    }
  }

  /**
   * Convert VAPID key from base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationManager = PushNotificationManager.getInstance();
