import { useQuery } from '@tanstack/react-query';
import { getServerHealth } from './get-server-health';

export const useServerHealth = () =>
  useQuery({
    queryKey: [getServerHealth.name],
    queryFn: getServerHealth,
  });
