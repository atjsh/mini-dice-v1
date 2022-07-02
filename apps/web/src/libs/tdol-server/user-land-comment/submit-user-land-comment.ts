import { UserLandCommentInputDto } from '@packages/shared-types';
import { AxiosResponse } from 'axios';
import { authedAxios } from '../auth';

export async function submitUserLandComment(dto: UserLandCommentInputDto) {
  await authedAxios.post<UserLandCommentInputDto, AxiosResponse>(
    '/land-comments',
    dto,
  );

  return dto;
}
