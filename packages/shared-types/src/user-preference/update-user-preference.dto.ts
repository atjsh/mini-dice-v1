import { UserPreferenceVo } from './user-preference.vo';

export type UpdateUserPreferenceDto = Partial<
  Pick<UserPreferenceVo, 'alwaysHideComments' | 'pushNotificationsEnabled'>
>;
