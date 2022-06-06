import { PlainMessageType } from '@packages/shared-types';
import { authedAxios } from '../auth';

export async function getNotifications(): Promise<PlainMessageType[]> {
  const response = await authedAxios.get<PlainMessageType[]>('/land-events');

  return response.data.reverse();
}
