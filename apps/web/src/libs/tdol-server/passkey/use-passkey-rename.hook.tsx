import { useMutation, useQueryClient } from 'react-query';
import { renamePasskey } from './passkey-api';

export const usePasskeyRename = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, name }: { id: string; name: string }) => renamePasskey(id, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('passkeys');
      },
    }
  );
};
