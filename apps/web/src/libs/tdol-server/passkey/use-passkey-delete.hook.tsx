import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePasskey } from './passkey-api';
import { PasskeyListQueryKey } from './use-passkey-list.hook';

export const usePasskeyDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePasskey(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PasskeyListQueryKey }),
  });
};
