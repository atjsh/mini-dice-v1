import { authedAxios } from '../tdol-server/auth/access-token';

interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

interface SubscriptionData {
  endpoint: string;
  keys?: PushSubscriptionKeys;
  expirationTime?: number | null;
}

interface CurrentSubscriptionStatusResponse {
  subscribed: boolean;
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
   * Get VAPID public key from server
   */
  async getVapidPublicKey(): Promise<string> {
    const response = await authedAxios.get<{ publicKey: string }>(
      '/push/vapid-public-key',
    );
    return response.data.publicKey;
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('서비스 워커를 지원하지 않는 브라우저입니다.');
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/sw-push.js',
        {
          scope: '/',
        },
      );

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  private async getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      return null;
    }

    const registration = await navigator.serviceWorker.getRegistration('/');
    if (!registration) {
      return null;
    }

    return await registration.pushManager.getSubscription();
  }

  private async saveSubscriptionToServer(
    subscription: PushSubscription,
  ): Promise<void> {
    const subscriptionJson = subscription.toJSON() as SubscriptionData;

    if (!subscriptionJson.endpoint) {
      throw new Error('푸시 알림 정보를 확인하지 못했습니다.');
    }

    const response = await authedAxios.post('/push/subscribe', {
      endpoint: subscriptionJson.endpoint,
      keys: subscriptionJson.keys,
      expirationTime: subscriptionJson.expirationTime,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('푸시 알림 등록을 저장하지 못했습니다.');
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('알림을 지원하지 않는 브라우저입니다.');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Subscribe to push notifications.
   * Uses a unified subscription method that works with both declarative and service worker push.
   * The browser will automatically handle the appropriate format based on its capabilities.
   */
  async subscribeToPushNotifications(): Promise<{
    success: boolean;
  }> {
    if (!this.isSupported()) {
      throw new Error('푸시 알림을 지원하지 않는 브라우저입니다.');
    }

    // Request permission
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('알림 권한이 거부되었습니다.');
    }

    const registration = await this.registerServiceWorker();
    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await this.saveSubscriptionToServer(existingSubscription);
      return { success: true };
    }

    const vapidPublicKey = await this.getVapidPublicKey();
    const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    // Send to server - server will send unified payload format.
    // If this browser endpoint belonged to a previous account, the server
    // transfers it to the current authenticated user.
    await this.saveSubscriptionToServer(subscription);

    return { success: true };
  }

  /**
   * Check if user is currently subscribed
   */
  async isPushSubscribed(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const subscription = await this.getCurrentSubscription();
      if (!subscription) {
        return false;
      }

      const subscriptionJson = subscription.toJSON() as SubscriptionData;
      if (!subscriptionJson.endpoint) {
        return false;
      }

      const response = await authedAxios.post<
        { endpoint: string },
        { data: CurrentSubscriptionStatusResponse; status: number }
      >('/push/current-subscription-status', {
        endpoint: subscriptionJson.endpoint,
      });

      return response.status === 200 && response.data.subscribed === true;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPushNotifications(): Promise<void> {
    await this.unsubscribeCurrentDevice();
  }

  /**
   * Remove only this browser/device subscription for the current user.
   */
  async unsubscribeCurrentDevice(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      const subscription = await this.getCurrentSubscription();
      if (subscription) {
        const subscriptionJson = subscription.toJSON() as SubscriptionData;
        let serverError: Error | null = null;

        if (subscriptionJson.endpoint) {
          try {
            const response = await authedAxios.delete('/push/unsubscribe', {
              data: {
                endpoint: subscriptionJson.endpoint,
              },
            });

            if (response.status !== 200 && response.status !== 201) {
              serverError = new Error('푸시 알림 해제를 저장하지 못했습니다.');
            }
          } catch (error) {
            serverError =
              error instanceof Error
                ? error
                : new Error('푸시 알림 해제를 저장하지 못했습니다.');
          }
        }

        await subscription.unsubscribe();

        if (serverError) {
          throw serverError;
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
  private urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
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
