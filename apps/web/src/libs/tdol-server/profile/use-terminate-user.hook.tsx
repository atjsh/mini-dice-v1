import { useMutation } from 'react-query';
import { logoutUser } from '../auth';
import { terminateUser } from './user-profile';

export const useTerminateUser = () =>
  useMutation(terminateUser.name, terminateUser, {
    onSuccess: async () => {
      await logoutUser();
    },
  });
