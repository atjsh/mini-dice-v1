import { useLogout } from '../libs';

export function LogoutPage() {
  const { data } = useLogout();

  if (data?.success == true) {
    location.href = '/';
  }

  return <></>;
}
