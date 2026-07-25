import { startAuthentication } from '@simplewebauthn/browser';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../query-client';
import { revokeUserAccessToken } from '../auth/access-token';
import { getUserVo } from '../profile/user-profile';
import { UseUserHookKey } from '../profile/use-user.hook';
import { getAuthenticationOptions, verifyAuthentication } from './passkey-api';

export const usePasskeyAuthenticate = () => {
  return useMutation({
    mutationFn: async () => {
      const options = await getAuthenticationOptions();
      const credential = await startAuthentication({ optionsJSON: options });
      const result = await verifyAuthentication(credential);

      if (result.success) {
        revokeUserAccessToken();
        await queryClient.fetchQuery({
          queryKey: UseUserHookKey,
          queryFn: getUserVo,
        });
      }

      return result;
    },
  });
};
