import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
} from './atoms/dice-toss-activity.atom';
import { tossDice } from './dice-toss';
import { useSkillLogMessages } from '../../../components/skill-log-message/use-skill-log-messages.hook';
import { currentSkillRouteAtom } from '../../../components/map/current-skill-route.atom';
import { queryClient } from '../../../';
import { UserVo } from '@packages/shared-types';
import { UseUserHookKey } from '../profile';
import { getMap } from '..';
import {
  diceTossingDelayTimeMS,
  getSkillLogMessageAddingDelayTiming,
  mapMovingDelayTimeMS,
  sleep,
} from '../../../common/timing';

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useDiceToss = () => {
  const [diceTossActivityStatus, setDiceTossActivityStatus] = useRecoilState(
    diceTossActivityStatusAtom,
  );
  const { addSkillLogMessages } = useSkillLogMessages();
  const [currentSkillRoute, setCurrentSkillRoute] = useRecoilState(
    currentSkillRouteAtom,
  );

  return useMutation(tossDice, {
    onMutate: async () => {
      setDiceTossActivityStatus(DiceTossActivityEnum.Submitted);
      await sleep(getRandomInteger(300, 600));
    },
    onSuccess: async (data) => {
      setDiceTossActivityStatus(DiceTossActivityEnum.Processing);

      addSkillLogMessages([
        {
          skillLogMessage: {
            message: data.skillLog.skillDrawResult.userRequestDrawings,
            date: data.skillLog.skillDrawResult.date,
            skillLogId: data.skillLog.id,
          },
        },
      ]);
      await sleep(diceTossingDelayTimeMS);

      setDiceTossActivityStatus(DiceTossActivityEnum.ResultShowing);
      queryClient.refetchQueries([getMap.name]);
      setCurrentSkillRoute(data.skillLog.skillRoute);
      await sleep(mapMovingDelayTimeMS);

      addSkillLogMessages(
        data.skillLog.skillDrawResult.actionResultDrawings.map(
          (actionResultDrawing, index) => ({
            delay: getSkillLogMessageAddingDelayTiming(index),
            skillLogMessage: {
              message: actionResultDrawing,
              date: data.skillLog.skillDrawResult.date,
              skillLogId: data.skillLog.id,
            },
          }),
        ),
      );
      await sleep(
        getSkillLogMessageAddingDelayTiming(
          data.skillLog.skillDrawResult.actionResultDrawings.length - 1,
        ),
      );

      setDiceTossActivityStatus(DiceTossActivityEnum.Idle);
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
    },
  });
};
