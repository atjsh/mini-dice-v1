import { NotificationMessageType } from '@packages/shared-types';
import { authedAxios } from '../auth';

export async function getNotifications(): Promise<NotificationMessageType[]> {
  const response = await authedAxios.get<NotificationMessageType[]>(
    '/land-events',
  );

  return response.data;
}
