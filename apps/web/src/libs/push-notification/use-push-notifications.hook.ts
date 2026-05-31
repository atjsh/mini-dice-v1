import { useEffect, useState } from 'react';
import { pushNotificationManager } from './push-notification-manager';
import { onlineStatusTracker } from './online-status-tracker';

interface UsePushNotificationsResult {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  permission: NotificationPermission;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  error: string | null;
}

export function usePushNotifications(): UsePushNotificationsResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string | null>(null);

  // Check support and subscription status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        
        const supported = pushNotificationManager.isSupported();
        setIsSupported(supported);

        if (supported) {
          const currentPermission = Notification.permission;
          setPermission(currentPermission);

          const subscribed = await pushNotificationManager.isPushSubscribed();
          setIsSubscribed(subscribed);

          // Start tracking if subscribed
          if (subscribed && !onlineStatusTracker.isTrackingActive()) {
            onlineStatusTracker.startTracking();
          }
        }
      } catch (err) {
        console.error('Error checking push notification status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

    // Cleanup on unmount
    return () => {
      // Don't stop tracking on unmount, let it continue
      // It will be stopped when user explicitly unsubscribes
    };
  }, []);

  const subscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await pushNotificationManager.subscribeToPushNotifications();
      
      if (result.success) {
        setIsSubscribed(true);
        setPermission('granted');
        
        // Start tracking online status
        onlineStatusTracker.startTracking();
      }
    } catch (err) {
      console.error('Error subscribing to push notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await pushNotificationManager.unsubscribeFromPushNotifications();
      setIsSubscribed(false);
      
      // Stop tracking online status
      onlineStatusTracker.stopTracking();
    } catch (err) {
      console.error('Error unsubscribing from push notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    error,
  };
}
