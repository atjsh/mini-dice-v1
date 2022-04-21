import { useQuery } from 'react-query';
import { getSkillLogs } from './get-skill-logs';

export const useSkillLogs = () =>
  useQuery(getSkillLogs.name, () => getSkillLogs(30), {
    retry: false,
  });
