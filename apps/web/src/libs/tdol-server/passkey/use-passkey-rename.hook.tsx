import { useMutation, useQueryClient } from 'react-query';
import { renamePasskey } from './passkey-api';
import { PasskeyListQueryKey } from './use-passkey-list.hook';

export const usePasskeyRename = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, name }: { id: string; name: string }) => renamePasskey(id, name),
    {
      onSuccess: () => queryClient.invalidateQueries(PasskeyListQueryKey),
    },
  );
};
