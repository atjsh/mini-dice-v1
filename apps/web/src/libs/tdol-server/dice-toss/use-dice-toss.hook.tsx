import { UserVo } from '@packages/shared-types';
import { diceTossButtonState } from '../../../components/dice-toss-button/dice-toss-button-state.atom';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { tossDice } from '.';
import { UseUserHookKey, getLatestSkillRoute } from '..';
import { queryClient } from '../../..';
import { useDisplayingMessages } from '../../../components/displaying-messages/use-displaying-messages.hook';
import { getMap } from '../map';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useDiceToss = () => {
  const { addExposedSkillLogs } = useDisplayingMessages();
  const [diceTossButton, setDiceTossButton] =
    useRecoilState(diceTossButtonState);

  return useMutation(tossDice, {
    onMutate: async () => {
      await sleep(getRandomInteger(300, 600));
    },
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      setDiceTossButton({ isPending: false });
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
      queryClient.refetchQueries([getLatestSkillRoute.name]);
      queryClient.refetchQueries([getMap.name]);
    },
  });
};
