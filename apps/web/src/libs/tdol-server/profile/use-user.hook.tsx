import { useMutation, useQuery } from "react-query";
import { updateUserProfile } from ".";
import { queryClient } from "../../..";
import { getUserProfile } from "./user-profile";

export const UseUserHookKey = getUserProfile.name;

export const useUser = () =>
  useQuery(UseUserHookKey, getUserProfile, {
    retry: false
  });

export const useMutateUser = () =>
  useMutation(updateUserProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData(UseUserHookKey, data);
    }
  });
