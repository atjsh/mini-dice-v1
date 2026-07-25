import { useQuery } from '@tanstack/react-query';
import { listPasskeys } from './passkey-api';
import { getPasskeyMetadata } from './passkey-metadata';

export const PasskeyListQueryKey = ['passkeys'] as const;

export const usePasskeyList = () => {
  return useQuery({
    queryKey: PasskeyListQueryKey,
    queryFn: async () => {
      const passkeys = await listPasskeys();

      return Promise.all(
        passkeys.map(async (passkey) => ({
          ...passkey,
          metadata: await getPasskeyMetadata(passkey.aaguid),
        })),
      );
    },
  });
};
