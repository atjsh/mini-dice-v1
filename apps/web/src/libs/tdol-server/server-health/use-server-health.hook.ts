import { useQuery } from 'react-query';
import { getServerHealth } from './get-server-health';

export const useServerHealth = () =>
  useQuery(getServerHealth.name, getServerHealth);
