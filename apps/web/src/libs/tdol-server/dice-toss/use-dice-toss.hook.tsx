import { UserVo } from '@packages/shared-types';
import { diceTossButtonState } from '../../../components/dice-toss-button/dice-toss-button-state.atom';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { tossDice } from '.';
import { UseUserHookKey, getLatestSkillRoute } from '..';
import { queryClient } from '../../..';
import { useDisplayingMessages } from '../../../components/displaying-messages/use-displaying-messages.hook';
import { getMap } from '../map';

export const useDiceToss = () => {
  const { addExposedSkillLogs } = useDisplayingMessages();
  const [diceTossButton, setDiceTossButton] =
    useRecoilState(diceTossButtonState);

  return useMutation(tossDice, {
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      setDiceTossButton({ isPending: false });
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
      queryClient.refetchQueries([getLatestSkillRoute.name]);
      queryClient.refetchQueries([getMap.name]);
    },
  });
};
