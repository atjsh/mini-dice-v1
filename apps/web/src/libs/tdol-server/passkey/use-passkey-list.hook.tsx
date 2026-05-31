import { useQuery } from 'react-query';
import { listPasskeys } from './passkey-api';

export const usePasskeyList = () => {
  return useQuery('passkeys', listPasskeys);
};
