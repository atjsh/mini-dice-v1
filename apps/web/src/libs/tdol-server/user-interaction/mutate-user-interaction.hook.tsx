import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { submitUserInteraction } from '.';
import { UseUserHookKey } from '..';
import { queryClient } from '../../..';
import { useDisplayingMessages } from '../../../components/displaying-messages/use-displaying-messages.hook';

export const useSubmitUserInteraction = (
  onErrorCallback?: (error: unknown) => any,
) => {
  const { addExposedSkillLogs } = useDisplayingMessages();

  return useMutation(submitUserInteraction, {
    onError: onErrorCallback,
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
    },
  });
};
