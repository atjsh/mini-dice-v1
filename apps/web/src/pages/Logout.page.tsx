import { useLogout } from "../libs";

export function LogoutPage() {
  useLogout();
  window.location.href = "/";
  return <></>;
}
