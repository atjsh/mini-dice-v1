import { UserVo } from '@packages/shared-types';
import { diceTossButtonState } from '../../../components/dice-toss-button/dice-toss-button-state.atom';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { tossDice } from '.';
import { queryClient } from '../../..';
import { getMap } from '../map';
import { UseUserHookKey } from '../profile';
import { ExposedSkillLogType, getSkillLogs } from '../skill-logs';
import { MAP_TRANSITION_MS } from '../../../components/map/map-status-bar.component';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useDiceToss = () => {
  const [diceTossButton, setDiceTossButton] =
    useRecoilState(diceTossButtonState);

  return useMutation(tossDice, {
    onMutate: async () => {
      await sleep(getRandomInteger(300, 600));
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        getSkillLogs.name,
        (state?: ExposedSkillLogType[]) => [...(state ?? []), data.skillLog],
      );
      queryClient.refetchQueries([getMap.name]);
      queryClient.refetchQueries([getSkillLogs.name]);
      setTimeout(() => {
        setDiceTossButton({ isPending: false });
        queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
      }, MAP_TRANSITION_MS);
    },
  });
};
