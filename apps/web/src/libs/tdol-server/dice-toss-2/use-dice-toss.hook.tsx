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
      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Submitted,
        reason: null,
      });
    },
    onSuccess: async (data) => {
      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Processing,
        reason: null,
      });

      addSkillLogMessages(
        data.skillLog.skillDrawResult.userRequestDrawings.map(
          (actionResultDrawing, index) => ({
            delay: index == 0 ? 0 : diceTossingDelayTimeMS + 300,
            skillLogMessage: {
              message: actionResultDrawing,
              date: new Date(data.skillLog.skillDrawResult.date),
              skillLogId: data.skillLog.id,
            },
          }),
        ),
      );
      if (currentSkillRoute) {
        await sleep(diceTossingDelayTimeMS);
      }

      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.ResultShowing,
        reason: null,
      });
      await sleep(200);

      queryClient.refetchQueries([getMap.name]);
      setCurrentSkillRoute(data.skillLog.skillRoute);
      if (currentSkillRoute) {
        await sleep(mapMovingDelayTimeMS + 200);
      }

      addSkillLogMessages(
        data.skillLog.skillDrawResult.actionResultDrawings.map(
          (actionResultDrawing, index) => ({
            delay: getSkillLogMessageAddingDelayTiming(index),
            skillLogMessage: {
              message: actionResultDrawing,
              date: new Date(data.skillLog.skillDrawResult.date),
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

      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Idle,
        reason: null,
      });
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
    },
  });
};
