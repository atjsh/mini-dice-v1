import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserPreference,
  updateUserPreference,
  type UpdateUserPreferenceDto,
} from './user-preference';

const USER_PREFERENCE_QUERY_KEY = ['user-preference'] as const;

export function useUserPreference() {
  return useQuery({
    queryKey: USER_PREFERENCE_QUERY_KEY,
    queryFn: getUserPreference,
  });
}

export function useUpdateUserPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateDto: UpdateUserPreferenceDto) =>
      updateUserPreference(updateDto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: USER_PREFERENCE_QUERY_KEY }),
  });
}
