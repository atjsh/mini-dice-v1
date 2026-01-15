import { startAuthentication } from '@simplewebauthn/browser';
import { useMutation } from 'react-query';
import {
  getAuthenticationOptions,
  verifyAuthentication,
} from './passkey-api';

export const usePasskeyAuthenticate = () => {
  return useMutation(async () => {
    const options = await getAuthenticationOptions();
    const credential = await startAuthentication(options);
    return await verifyAuthentication(options.challengeId, credential);
  });
};
