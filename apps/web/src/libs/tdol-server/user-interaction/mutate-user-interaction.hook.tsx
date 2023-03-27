import { UserVo } from '@packages/shared-types';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { submitUserInteraction } from '.';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
  ExposedSkillLogType,
  getMap,
  getSkillLogs,
  UseUserHookKey,
} from '..';
import { queryClient } from '../../..';
import { getSkillLogMessageAddingDelayTiming } from '../../../common/timing';
import {
  usePageTimeout,
  useSkillLogMessages,
} from '../../../components/skill-log-message/use-skill-log-messages.hook';

export const useSubmitUserInteraction = (
  onErrorCallback?: (error: unknown) => any,
) => {
  const { addSkillLogMessages } = useSkillLogMessages();
  const [, setDiceTossActivityStatus] = useRecoilState(
    diceTossActivityStatusAtom,
  );
  const { pushPageTimeout } = usePageTimeout();

  return useMutation(submitUserInteraction, {
    onError: onErrorCallback,
    onMutate: async () => {
      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Submitted,
        reason: '처리 중...',
      });
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<ExposedSkillLogType[]>(
        getSkillLogs.name,
        (prevData) => [...(prevData ? prevData : []), data.skillLog],
      );

      setDiceTossActivityStatus({
        enum: DiceTossActivityEnum.Processing,
        reason: '처리 중...',
      });
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

      pushPageTimeout(
        setTimeout(() => {
          setDiceTossActivityStatus({
            enum: DiceTossActivityEnum.Idle,
            reason: null,
          });
          queryClient.setQueryData<UserVo>(UseUserHookKey, data.user);
        }, getSkillLogMessageAddingDelayTiming(data.skillLog.skillDrawResult.userRequestDrawings.length + data.skillLog.skillDrawResult.actionResultDrawings.length - 1)),
      );
    },
  });
};
