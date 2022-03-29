import { useMutation } from 'react-query';
import { submitTempSignup } from './submit-temp-signup';
import { queryClient } from '../../..';
import { UseUserHookKey } from '..';

export const useTempSignup = () =>
  useMutation(submitTempSignup, {
    onSuccess: () => {
      queryClient.refetchQueries([UseUserHookKey]);
    },
  });
