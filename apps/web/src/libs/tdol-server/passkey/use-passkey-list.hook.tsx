import { useQuery } from 'react-query';
import { listPasskeys } from './passkey-api';
import { getPasskeyMetadata } from './passkey-metadata';

export const PasskeyListQueryKey = 'passkeys';

export const usePasskeyList = () => {
  return useQuery(PasskeyListQueryKey, async () => {
    const passkeys = await listPasskeys();

    return Promise.all(
      passkeys.map(async (passkey) => ({
        ...passkey,
        metadata: await getPasskeyMetadata(passkey.aaguid),
      })),
    );
  });
};
