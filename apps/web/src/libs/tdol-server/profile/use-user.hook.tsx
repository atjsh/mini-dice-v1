import { UserEntityJson } from '@packages/shared-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../query-client';
import { getUserVo, updateUserVo } from './user-profile';

export const UseUserHookKey = [getUserVo.name] as const;

export const useUser = () =>
  useQuery({
    queryKey: UseUserHookKey,
    queryFn: getUserVo,
  });

export const useMutateUser = () =>
  useMutation({
    mutationKey: [updateUserVo.name],
    mutationFn: updateUserVo,
    onSuccess: async (normalizedUser) => {
      const currentUser =
        queryClient.getQueryData<UserEntityJson>(UseUserHookKey);

      if (currentUser) {
        queryClient.setQueryData<UserEntityJson>(UseUserHookKey, {
          ...currentUser,
          ...normalizedUser,
        });
      }

      await queryClient.invalidateQueries({ queryKey: UseUserHookKey });
    },
  });
