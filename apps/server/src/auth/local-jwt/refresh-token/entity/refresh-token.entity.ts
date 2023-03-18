import type { UserIdType } from '@packages/shared-types';

export class RefreshTokenEntity {
  value: string;

  userId: UserIdType;
}
