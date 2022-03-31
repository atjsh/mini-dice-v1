import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  ExposedSkillLogType,
  transformSkillLogToMessage,
  useSkillLogs,
} from '../../libs';
import { displayingMessagesState } from './atoms/displaying-messages.atom';

const skillLogsToRenderesMessage = (
  skillLogs: ExposedSkillLogType[],
  skillLogId: string,
) =>
  skillLogs
    .map((log) => {
      const message = transformSkillLogToMessage(
        log.skillDrawResult,
        log.id == skillLogId,
        log.id,
      );
      return [
        message.userActivityMessage,
        ...message.serverMessages.slice(0, message.serverMessages.length - 1),
        <>
          {message.serverMessages.slice(message.serverMessages.length - 1)}
          {message.time}
        </>,
      ];
    })
    .flat();

export const useDisplayingMessages = () => {
  const { data: rawExposedSkillLogs } = useSkillLogs();
  const exposedSkillLogs = rawExposedSkillLogs ?? [];

  const [displayingMessages, setDisplayingMessages] = useRecoilState(
    displayingMessagesState,
  );
  const [lastExposedSkillLogIndex, setLastExposedSkillLogIndex] = useState(0);

  const skillLogId =
    exposedSkillLogs.length > 0
      ? exposedSkillLogs[exposedSkillLogs.length - 1].id
      : '';

  useEffect(() => {
    if (lastExposedSkillLogIndex == 0) {
      const renderedMessages = skillLogsToRenderesMessage(
        exposedSkillLogs,
        skillLogId,
      );
      setDisplayingMessages(renderedMessages);
      setLastExposedSkillLogIndex(exposedSkillLogs.length);
    } else {
      const addedSkillLogs = exposedSkillLogs.slice(lastExposedSkillLogIndex);
      const wasSkillLogs = exposedSkillLogs.slice(0, lastExposedSkillLogIndex);
      const addedSkillLogsRenderedMessages = skillLogsToRenderesMessage(
        addedSkillLogs,
        skillLogId,
      );
      const wasSkillLogsRenderedMessages = skillLogsToRenderesMessage(
        wasSkillLogs,
        skillLogId,
      );

      const steps: JSX.Element[][] = addedSkillLogsRenderedMessages.map(
        (message, index) => [
          ...wasSkillLogsRenderedMessages,
          ...addedSkillLogsRenderedMessages.slice(0, index + 1),
        ],
      );

      steps.map((step, index) =>
        setTimeout(() => {
          setDisplayingMessages(step);
        }, [0, 300, 1000, 1700][index] ?? (index + 1) * 600),
      );

      setLastExposedSkillLogIndex(exposedSkillLogs.length);
    }
  }, [exposedSkillLogs]);

  return {
    displayingMessages,
  };
};
