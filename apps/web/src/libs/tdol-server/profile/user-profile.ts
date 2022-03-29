import { UserVo } from '@packages/shared-types';
import { queryClient } from '../../..';
import { useMutation } from 'react-query';
import { authedAxios, UseUserHookKey } from '..';

export async function getUserVo(): Promise<UserVo> {
  const response = await authedAxios.get<UserVo>(`/profile/me`);
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

export const useCompleteSignup = () =>
  useMutation(userCompleteSignup, {
    onSuccess: () => {
      queryClient.refetchQueries([UseUserHookKey]);
    },
  });
