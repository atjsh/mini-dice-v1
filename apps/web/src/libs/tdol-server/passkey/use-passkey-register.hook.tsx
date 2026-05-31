import { startRegistration } from '@simplewebauthn/browser';
import { useMutation, useQueryClient } from 'react-query';
import { getRegistrationOptions, verifyRegistration } from './passkey-api';

export const usePasskeyRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (name?: string) => {
      const options = await getRegistrationOptions();
      const credential = await startRegistration(options);
      return await verifyRegistration(credential, name);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('passkeys');
      },
    }
  );
};
