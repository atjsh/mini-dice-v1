import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { submitUserInteraction } from '.';
import { ExposedSkillLogType, getSkillLogs, UseUserHookKey } from '..';
import { queryClient } from '../../..';

export const useSubmitUserInteraction = (
  onErrorCallback?: (error: unknown) => any,
) => {
  return useMutation(submitUserInteraction, {
    onError: onErrorCallback,
    onSuccess: (data) => {
      queryClient.setQueryData(
        getSkillLogs.name,
        (state?: ExposedSkillLogType[]) => [...(state ?? []), data.skillLog],
      );
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
    },
  });
};
