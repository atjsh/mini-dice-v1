import { useMutation, useQueryClient } from 'react-query';
import { deletePasskey } from './passkey-api';

export const usePasskeyDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation((id: string) => deletePasskey(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('passkeys');
    },
  });
};
