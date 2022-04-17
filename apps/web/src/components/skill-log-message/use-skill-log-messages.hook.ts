import { useRecoilState } from 'recoil';
import { skillLogMessagesState } from './atoms/skill-log-messages.atom';
import { SkillLogMessageInerface } from './interfaces/skill-log-message.interface';

export interface PushSkillLogMessageInterface {
  skillLogMessage: SkillLogMessageInerface;
  delay?: number;
}

export const useSkillLogMessages = () => {
  const [skillLogMessages, setSkillLogMessages] = useRecoilState(
    skillLogMessagesState,
  );

  function addSkillLogMessages(
    pushSkillLogMessages: PushSkillLogMessageInterface[],
  ) {
    pushSkillLogMessages.map(({ skillLogMessage, delay }) => {
      if (delay) {
        setTimeout(() => {
          setSkillLogMessages((old) => [...old, skillLogMessage]);
        }, delay);
      } else {
        setSkillLogMessages((old) => [...old, skillLogMessage]);
      }
    });
  }

  function initSkillLogMessages(skillLogMessages: SkillLogMessageInerface[]) {
    setSkillLogMessages(skillLogMessages);
  }

  return { skillLogMessages, addSkillLogMessages, initSkillLogMessages };
};
