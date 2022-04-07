import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { submitUserInteraction } from '.';
import { getMap, UseUserHookKey } from '..';
import { queryClient } from '../../..';
import {
  getSkillLogMessageAddingDelayTiming,
  sleep,
} from '../../../common/timing';
import { useSkillLogMessages } from '../../../components/skill-log-message/use-skill-log-messages.hook';

export const useSubmitUserInteraction = (
  onErrorCallback?: (error: unknown) => any,
) => {
  const { addSkillLogMessages } = useSkillLogMessages();

  return useMutation(submitUserInteraction, {
    onError: onErrorCallback,
    onSuccess: async (data) => {
      queryClient.refetchQueries([getMap.name]);

      addSkillLogMessages(
        [
          data.skillLog.skillDrawResult.userRequestDrawings.map(
            (actionResultDrawing, index) => ({
              delay: getSkillLogMessageAddingDelayTiming(index),
              skillLogMessage: {
                message: actionResultDrawing,
                date: new Date(data.skillLog.skillDrawResult.date),
                skillLogId: data.skillLog.id,
              },
            }),
          ),
          data.skillLog.skillDrawResult.actionResultDrawings.map(
            (actionResultDrawing, index) => ({
              delay: getSkillLogMessageAddingDelayTiming(
                index +
                  data.skillLog.skillDrawResult.userRequestDrawings.length,
              ),
              skillLogMessage: {
                message: actionResultDrawing,
                date: new Date(data.skillLog.skillDrawResult.date),
                skillLogId: data.skillLog.id,
              },
            }),
          ),
        ].flat(),
      );

      await sleep(
        getSkillLogMessageAddingDelayTiming(
          data.skillLog.skillDrawResult.actionResultDrawings.length - 1,
        ),
      );
      queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
    },
  });
};
