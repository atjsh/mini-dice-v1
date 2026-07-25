import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../auth';
import { terminateUser } from './user-profile';

export const useTerminateUser = () =>
  useMutation({
    mutationKey: [terminateUser.name],
    mutationFn: terminateUser,
    onSuccess: async () => {
      await logoutUser();
    },
  });
