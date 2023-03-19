import { type UserLandComponentInput } from '@packages/shared-types';
import { AxiosResponse } from 'axios';
import { authedAxios } from '../auth';

export async function submitUserLandComment(dto: UserLandComponentInput) {
  await authedAxios.post<UserLandComponentInput, AxiosResponse>(
    '/land-comments',
    dto,
  );

  return dto;
}
