import {
  PublicProfileVo,
  UpdateUserDto,
  UserEntityJson,
  UserVo,
} from '@packages/shared-types';
import { useMutation } from '@tanstack/react-query';
import { authedAxios, UseUserHookKey } from '..';
import axios from 'axios';
import { queryClient } from '../../../query-client';

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
  partialUser: UpdateUserDto,
): Promise<UpdateUserDto> {
  const response = await authedAxios.patch<unknown>(`/profile/me`, partialUser);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to update user (${response.status})`);
  }

  return partialUser;
}

export async function userCompleteSignup(
  partialUser: Partial<UserVo>,
): Promise<UserVo> {
  const response = await authedAxios.patch<UserVo>(
    `/profile/complete-signup`,
    partialUser,
  );
  return response.data;
}

export async function terminateUser() {
  const response = await authedAxios.delete<unknown>('/profile');
  return response;
}

export const useCompleteSignup = () =>
  useMutation({
    mutationFn: userCompleteSignup,
    onSuccess: () => queryClient.refetchQueries({ queryKey: UseUserHookKey }),
  });
