import {
  PublicProfileVo,
  UserEntityJson,
  UserVo,
} from '@packages/shared-types';
import { queryClient } from '../../..';
import { useMutation } from 'react-query';
import { authedAxios, UseUserHookKey } from '..';
import axios from 'axios';

export async function getUserVo(): Promise<UserEntityJson> {
  const response = await authedAxios.get<UserEntityJson>(`/profile/me`);
  if (response.status == 403 || response.status == 401) {
    throw Error('User is not authenticated');
  }
  return response.data;
}

export async function getOthersProfiles(
  limit: number,
  page: number,
  updatedAfterOffset?: number,
): Promise<PublicProfileVo[]> {
  const response = await axios.get<PublicProfileVo[]>('profile/others', {
    params: {
      limit,
      page,
      updatedAfter: updatedAfterOffset
        ? new Date(Date.now() - updatedAfterOffset)
        : undefined,
    },
    baseURL: import.meta.env.VITE_SERVER_URL,
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
