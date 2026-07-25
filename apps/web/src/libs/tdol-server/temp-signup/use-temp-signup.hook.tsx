import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../query-client';
import { submitTempSignup } from './submit-temp-signup';
import { UseUserHookKey } from '..';

interface UseTempSignupOptions {
  refetchUserOnSuccess?: boolean;
}

export const useTempSignup = ({
  refetchUserOnSuccess = true,
}: UseTempSignupOptions = {}) =>
  useMutation({
    mutationFn: submitTempSignup,
    onSuccess: () =>
      refetchUserOnSuccess
        ? queryClient.refetchQueries({ queryKey: UseUserHookKey })
        : undefined,
  });
