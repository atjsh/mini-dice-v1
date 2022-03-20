import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { submitUserInteraction } from '.';
import { UseUserHookKey } from '..';
import { queryClient } from '../../..';
import { useDisplayingMessages } from '../../../components/displaying-messages/use-displaying-messages.hook';
import { latestSkillLogIdState } from '../skill-logs/atoms/latest-skill-log.atom';

export const useSubmitUserInteraction = (
  onErrorCallback?: (error: unknown) => any,
) => {
  const [skillLogId, setSkillLogId] = useRecoilState(latestSkillLogIdState);

  const { addExposedSkillLogs } = useDisplayingMessages();

  return useMutation(submitUserInteraction, {
    onError: onErrorCallback,
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
      setSkillLogId(data.skillLog.id);
    },
  });
};
