import { PublicProfileVo, UserVo } from '@packages/shared-types';
import { queryClient } from '../../..';
import { useMutation } from 'react-query';
import { authedAxios, UseUserHookKey } from '..';
import { revokeUserAccessToken } from '../auth';

export async function getUserVo(): Promise<UserVo> {
  const response = await authedAxios.get<UserVo>(`/profile/me`);
  if (response.status == 403) {
    revokeUserAccessToken();
    location.href = '/logout';
  }
  return response.data;
}

export async function getOthersProfiles(
  limit: number,
  page: number,
): Promise<PublicProfileVo[]> {
  const response = await authedAxios.get<PublicProfileVo[]>('profile/others', {
    params: {
      limit,
      page,
    },
  });

  return response.data;
}

export async function updateUserVo(
  partialUser: Partial<UserVo>,
): Promise<UserVo> {
  const response = await authedAxios.patch<Partial<UserVo>, UserVo>(
    `/profile/me`,
    partialUser,
  );
  return response;
}

export async function userCompleteSignup(
  partialUser: Partial<UserVo>,
): Promise<UserVo> {
  const response = await authedAxios.patch<Partial<UserVo>, UserVo>(
    `/profile/complete-signup`,
    partialUser,
  );
  return response;
}

export async function terminateUser() {
  const response = await authedAxios.delete('/profile');
  return response;
}

export const useCompleteSignup = () =>
  useMutation(userCompleteSignup, {
    onSuccess: () => {
      queryClient.refetchQueries([UseUserHookKey]);
    },
  });
