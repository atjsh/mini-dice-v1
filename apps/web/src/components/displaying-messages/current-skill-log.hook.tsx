import { useRecoilValue } from 'recoil';
import { exposedSkillLogsState } from './atoms/displaying-messages.atom';

export const useCurrentSkillLog = () => {
  const exposedSkillLogs = useRecoilValue(exposedSkillLogsState);

  return exposedSkillLogs.length > 0
    ? exposedSkillLogs[exposedSkillLogs.length - 1]
    : undefined;
};
