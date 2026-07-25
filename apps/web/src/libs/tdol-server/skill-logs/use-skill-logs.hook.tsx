import { useQuery } from '@tanstack/react-query';
import { getSkillLogs } from './get-skill-logs';

export const useSkillLogs = () =>
  useQuery({
    queryKey: [getSkillLogs.name],
    queryFn: () => getSkillLogs(10),
    retry: false,
    refetchOnMount: false,
  });
