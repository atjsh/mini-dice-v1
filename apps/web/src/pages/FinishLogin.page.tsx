import { revokeUserAccessToken } from '../libs';
import { ServicePageURL } from './routes';

export function FinishLoginPage() {
  revokeUserAccessToken();
  location.href = ServicePageURL;
  return <></>;
}
