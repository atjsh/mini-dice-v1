import { authedAxios } from '..';
import { UserVo } from '@packages/shared-types';

export async function getUserProfile(): Promise<UserVo> {
  const response = await authedAxios.get<UserVo>(`/profile/me`);
  return response.data;
}

export async function updateUserProfile(
  partialUser: Partial<UserVo>,
): Promise<UserVo> {
  const response = await authedAxios.patch<Partial<UserVo>, UserVo>(
    `/profile/me`,
    partialUser,
  );
  return response;
}
