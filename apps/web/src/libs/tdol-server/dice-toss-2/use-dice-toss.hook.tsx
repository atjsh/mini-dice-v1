import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { ExposedSkillLogType, getMap, getSkillLogs } from '..';
import { queryClient } from '../../../';
import {
  diceTossingDelayTimeMS,
  getSkillLogMessageAddingDelayTiming,
  mapMovingDelayTimeMS,
} from '../../../common/timing';
import { currentSkillRouteAtom } from '../../../components/map/current-skill-route.atom';
import {
  usePageTimeout,
  useSkillLogMessages,
} from '../../../components/skill-log-message/use-skill-log-messages.hook';
import { UseUserHookKey } from '../profile';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
} from './atoms/dice-toss-activity.atom';
import { tossDice } from './dice-toss';

function getDelayClosure() {
  let delay = 0;
  return function closure(addingDelay: number) {
    delay += addingDelay;
    return delay;
  };
}

export const useDiceToss = () => {
  const [diceTossActivityStatus, setDiceTossActivityStatus] = useRecoilState(
    diceTossActivityStatusAtom,
  );
  const { addSkillLogMessages } = useSkillLogMessages();
  const [currentSkillRoute, setCurrentSkillRoute] = useRecoilState(
    currentSkillRouteAtom,
  );
  const { pushPageTimeout } = usePageTimeout();

  return useMutation(tossDice, {
    onMutate: async () => {
      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Submitted,
        reason: '서버와 통신 중...',
      });
    },
    onSuccess: async (data) => {
      const delayClosure = getDelayClosure();

      queryClient.setQueryData<ExposedSkillLogType[]>(
        getSkillLogs.name,
        (prevData) => [...(prevData ? prevData : []), data.skillLog],
      );

      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Processing,
        reason: '🎲 주사위를 굴리는 중 ...',
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

      pushPageTimeout(
        setTimeout(() => {
          setDiceTossActivityStatus({
            enum: DiceTossActivityEnum.ResultShowing,
            reason: null,
          });
        }, delayClosure(currentSkillRoute ? diceTossingDelayTimeMS : 0)),
      );

      pushPageTimeout(
        setTimeout(() => {
          queryClient.refetchQueries([getMap.name]);
          setCurrentSkillRoute(data.skillLog.skillRoute);
        }, delayClosure(200)),
      );

      pushPageTimeout(
        setTimeout(() => {
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
        }, delayClosure(currentSkillRoute ? mapMovingDelayTimeMS + 200 : 0)),
      );

      pushPageTimeout(
        setTimeout(() => {
          setDiceTossActivityStatus({
            enum: DiceTossActivityEnum.Idle,
            reason: null,
          });
          queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
        }, delayClosure(getSkillLogMessageAddingDelayTiming(data.skillLog.skillDrawResult.actionResultDrawings.length - 1))),
      );
    },
  });
};
