import { UserIdType } from '../user/user.vo';

export class UserPreferenceVo {
  id: string;
  userId: UserIdType;
  alwaysHideComments: boolean;
  pushNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
