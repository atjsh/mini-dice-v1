import { useMutation, useQuery } from 'react-query';
import { updateUserVo } from '.';
import { queryClient } from '../../..';
import { getUserVo } from './user-profile';

export const UseUserHookKey = getUserVo.name;

export const useUser = () =>
  useQuery(UseUserHookKey, getUserVo, {
    retry: false,
  });

export const useMutateUser = () =>
  useMutation(updateUserVo.name, {
    onSuccess: (data) => {
      queryClient.setQueryData(UseUserHookKey, data);
    },
  });
