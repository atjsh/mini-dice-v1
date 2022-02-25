import { UserIdType } from '@apps/server/user/entity/user.entity';

export class RefreshTokenEntity {
  value: string;

  userId: UserIdType;
}
