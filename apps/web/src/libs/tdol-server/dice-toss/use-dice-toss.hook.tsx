import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { tossDice } from '.';
import { UseUserHookKey, getLatestSkillRoute } from '..';
import { queryClient } from '../../..';
import { useDisplayingMessages } from '../../../components/displaying-messages/use-displaying-messages.hook';
import { getMap } from '../map';
import { latestSkillLogIdState } from '../skill-logs/atoms/latest-skill-log.atom';

export const useDiceToss = () => {
  const [skillLogId, setSkillLogId] = useRecoilState(latestSkillLogIdState);
  const { addExposedSkillLogs } = useDisplayingMessages();

  return useMutation(tossDice, {
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
      queryClient.refetchQueries([getLatestSkillRoute.name]);
      queryClient.refetchQueries([getMap.name]);
      setSkillLogId(data.skillLog.id);
    },
  });
};
