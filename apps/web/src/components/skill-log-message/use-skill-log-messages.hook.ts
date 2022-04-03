import { useRecoilState } from 'recoil';
import { skillLogMessagesState } from './atoms/skill-log-messages.atom';
import { SkillLogMessageInerface } from './interfaces/skill-log-message.interface';

export interface PushSkillLogMessageInterface {
  skillLogMessage: SkillLogMessageInerface;
  delay?: number;
}

function getArrayFromArrayLatest<T>(array: T[], max: number): T[] {
  console.log(array.length);

  return array.length == max
    ? array.slice(Math.max(array.length - max, 0))
    : array;
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
          setSkillLogMessages((old) =>
            getArrayFromArrayLatest([...old, skillLogMessage], 50),
          );
        }, delay);
      } else {
        setSkillLogMessages((old) =>
          getArrayFromArrayLatest([...old, skillLogMessage], 50),
        );
      }
    });
  }

  function initSkillLogMessages(skillLogMessages: SkillLogMessageInerface[]) {
    setSkillLogMessages(skillLogMessages);
  }

  return { skillLogMessages, addSkillLogMessages, initSkillLogMessages };
};
