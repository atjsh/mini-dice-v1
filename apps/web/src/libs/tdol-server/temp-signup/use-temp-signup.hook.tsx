import { useMutation } from 'react-query';
import { submitTempSignup } from './submit-temp-signup';
import { queryClient } from '../../..';
import { UseUserHookKey } from '..';

interface UseTempSignupOptions {
  refetchUserOnSuccess?: boolean;
}

export const useTempSignup = ({
  refetchUserOnSuccess = true,
}: UseTempSignupOptions = {}) =>
  useMutation(submitTempSignup, {
    onSuccess: () => {
      if (refetchUserOnSuccess) {
        queryClient.refetchQueries(UseUserHookKey);
      }
    },
  });
