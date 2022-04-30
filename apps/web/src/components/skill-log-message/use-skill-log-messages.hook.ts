import { atom, useRecoilState } from 'recoil';
import { skillLogMessagesState } from './atoms/skill-log-messages.atom';
import { SkillLogMessageInerface } from './interfaces/skill-log-message.interface';

export interface PushSkillLogMessageInterface {
  skillLogMessage: SkillLogMessageInerface;
  delay?: number;
}

export const pageTimeoutsAtom = atom<ReturnType<typeof setTimeout>[]>({
  key: 'pageTimeoutsAtom',
  default: [],
});

export const usePageTimeout = () => {
  const [pageTimeouts, setPageTimeout] = useRecoilState(pageTimeoutsAtom);

  const pushPageTimeout = (timeout: ReturnType<typeof setTimeout>) =>
    setPageTimeout((old) => [...(old ? old : []), timeout]);

  return { pageTimeouts, pushPageTimeout };
};

export const useSkillLogMessages = () => {
  const [skillLogMessages, setSkillLogMessages] = useRecoilState(
    skillLogMessagesState,
  );
  const { pushPageTimeout } = usePageTimeout();

  function addSkillLogMessages(
    pushSkillLogMessages: PushSkillLogMessageInterface[],
  ) {
    pushSkillLogMessages.map(({ skillLogMessage, delay }) => {
      if (delay) {
        pushPageTimeout(
          setTimeout(() => {
            setSkillLogMessages((old) => [...old, skillLogMessage]);
          }, delay),
        );
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
