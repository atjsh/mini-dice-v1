import { authedAxios } from '../auth/access-token';

export interface UserPreference {
  id: string;
  userId: string;
  alwaysHideComments: boolean;
  pushNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserPreferenceDto {
  alwaysHideComments?: boolean;
  pushNotificationsEnabled?: boolean;
}

export async function getUserPreference(): Promise<UserPreference> {
  const response = await authedAxios.get<UserPreference>('/user-preference/me');
  return response.data;
}

export async function updateUserPreference(
  updateDto: UpdateUserPreferenceDto
): Promise<UserPreference> {
  const response = await authedAxios.patch<UserPreference>(
    '/user-preference/me',
    updateDto
  );
  return response.data;
}
