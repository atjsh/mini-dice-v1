import { startAuthentication } from '@simplewebauthn/browser';
import { useMutation } from 'react-query';
import { queryClient } from '../../..';
import { revokeUserAccessToken } from '../auth/access-token';
import { getUserVo } from '../profile/user-profile';
import { UseUserHookKey } from '../profile/use-user.hook';
import { getAuthenticationOptions, verifyAuthentication } from './passkey-api';

export const usePasskeyAuthenticate = () => {
  return useMutation(async () => {
    const options: any = await getAuthenticationOptions();
    const credential = await startAuthentication(options);
    const result: any = await verifyAuthentication(credential);

    if (result.success) {
      revokeUserAccessToken();
      await queryClient.fetchQuery(UseUserHookKey, getUserVo);
    }

    return result;
  });
};
