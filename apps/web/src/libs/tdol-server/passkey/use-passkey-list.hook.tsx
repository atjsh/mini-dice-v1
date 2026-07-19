import { useQuery } from 'react-query';
import { listPasskeys } from './passkey-api';

export const PasskeyListQueryKey = 'passkeys';

export const usePasskeyList = () => {
  return useQuery(PasskeyListQueryKey, listPasskeys);
};
