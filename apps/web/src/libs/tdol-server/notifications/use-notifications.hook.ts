import { useQuery } from 'react-query';
import { getNotifications } from './notifications';

export const useNotifications = () =>
  useQuery(getNotifications.name, getNotifications);
