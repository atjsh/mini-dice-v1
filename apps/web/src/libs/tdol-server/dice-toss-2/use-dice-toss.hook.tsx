import { UserVo } from '@packages/shared-types';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { ExposedSkillLogType, getMap, getSkillLogs } from '..';
import { queryClient } from '../../../query-client';
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
  const [, setDiceTossActivityStatus] = useAtom(diceTossActivityStatusAtom);
  const { addSkillLogMessages } = useSkillLogMessages();
  const [currentSkillRoute, setCurrentSkillRoute] = useAtom(
    currentSkillRouteAtom,
  );
  const { pushPageTimeout } = usePageTimeout();

  return useMutation({
    mutationFn: tossDice,
    onMutate: () => {
      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Submitted,
        reason: null,
      });
    },
    onSuccess: (data) => {
      const delayClosure = getDelayClosure();

      queryClient.setQueryData<ExposedSkillLogType[]>(
        [getSkillLogs.name],
        (prevData) => [...(prevData ? prevData : []), data.skillLog],
      );

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

      pushPageTimeout(
        setTimeout(
          () => {
            setDiceTossActivityStatus({
              enum: DiceTossActivityEnum.ResultShowing,
              reason: null,
            });
          },
          delayClosure(currentSkillRoute ? diceTossingDelayTimeMS : 0),
        ),
      );

      pushPageTimeout(
        setTimeout(() => {
          queryClient
            .refetchQueries({ queryKey: [getMap.name] })
            .catch((error: unknown) => {
              console.error('Failed to refresh the map:', error);
            });
          setCurrentSkillRoute(data.skillLog.skillRoute);
        }, delayClosure(200)),
      );

      pushPageTimeout(
        setTimeout(
          () => {
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
          },
          delayClosure(currentSkillRoute ? mapMovingDelayTimeMS + 200 : 0),
        ),
      );

      pushPageTimeout(
        setTimeout(
          () => {
            setDiceTossActivityStatus({
              enum: DiceTossActivityEnum.Idle,
              reason: null,
            });
            queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
          },
          delayClosure(
            getSkillLogMessageAddingDelayTiming(
              data.skillLog.skillDrawResult.actionResultDrawings.length - 1,
            ),
          ),
        ),
      );
    },
  });
};
