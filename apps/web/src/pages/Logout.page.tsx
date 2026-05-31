import { useLogout } from '../libs';
import { onlineStatusTracker } from '../libs/push-notification';

export function LogoutPage() {
  const { data } = useLogout();

  if (data?.success == true) {
    onlineStatusTracker.stopTracking();
    location.href = '/';
  }

  return <></>;
}
