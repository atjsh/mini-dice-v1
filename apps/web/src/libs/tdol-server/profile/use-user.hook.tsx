import { UserEntityJson } from '@packages/shared-types';
import { useMutation, useQuery } from 'react-query';
import { queryClient } from '../../..';
import { getUserVo, updateUserVo } from './user-profile';

export const UseUserHookKey = getUserVo.name;

export const useUser = () => useQuery(UseUserHookKey, getUserVo);

export const useMutateUser = () =>
  useMutation(updateUserVo.name, updateUserVo, {
    onSuccess: async (normalizedUser) => {
      const currentUser =
        queryClient.getQueryData<UserEntityJson>(UseUserHookKey);

      if (currentUser) {
        queryClient.setQueryData<UserEntityJson>(UseUserHookKey, {
          ...currentUser,
          ...normalizedUser,
        });
      }

      await queryClient.invalidateQueries(UseUserHookKey);
    },
  });
