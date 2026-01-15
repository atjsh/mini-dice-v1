import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getUserPreference,
  updateUserPreference,
  type UpdateUserPreferenceDto,
} from './user-preference';

const USER_PREFERENCE_QUERY_KEY = 'user-preference';

export function useUserPreference() {
  return useQuery(USER_PREFERENCE_QUERY_KEY, getUserPreference);
}

export function useUpdateUserPreference() {
  const queryClient = useQueryClient();

  return useMutation(
    (updateDto: UpdateUserPreferenceDto) => updateUserPreference(updateDto),
    {
      onSuccess: () => {
        // Invalidate and refetch user preference
        queryClient.invalidateQueries(USER_PREFERENCE_QUERY_KEY);
      },
    }
  );
}
