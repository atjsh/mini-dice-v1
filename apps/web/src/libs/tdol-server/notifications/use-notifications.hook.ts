import { useQuery } from '@tanstack/react-query';
import { getNotifications } from './notifications';

export const useNotifications = () =>
  useQuery({
    queryKey: [getNotifications.name],
    queryFn: getNotifications,
  });
