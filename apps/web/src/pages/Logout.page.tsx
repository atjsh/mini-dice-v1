import { useLogout } from '../libs';

export function LogoutPage() {
  const { isSuccess } = useLogout();
  if (isSuccess) {
    window.location.href = '/';
  }

  return <></>;
}
