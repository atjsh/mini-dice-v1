import { UserIdType } from '../user/user.vo';

export class UserPreferenceVo {
  id: string;
  userId: UserIdType;
  alwaysHideComments: boolean;
  createdAt: Date;
  updatedAt: Date;
}
