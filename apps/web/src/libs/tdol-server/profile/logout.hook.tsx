import { useQuery } from 'react-query';
import {
  onlineStatusTracker,
  pushNotificationManager,
} from '../../push-notification';
import { logoutUser } from '../auth/access-token';

async function logoutCurrentBrowserSession() {
  try {
    await pushNotificationManager.unsubscribeCurrentDevice();
  } catch (error) {
    console.error('Failed to remove current browser push subscription:', error);
  } finally {
    onlineStatusTracker.stopTracking();
  }

  return await logoutUser();
}

export const useLogout = () =>
  useQuery(logoutUser.name, logoutCurrentBrowserSession);
