import { ForbiddenException } from '@nestjs/common';
import {
  UserEntityJson,
  getStockStatus,
  serializeStockStatusToJson,
} from '@packages/shared-types';
import { UserEntity } from './entity/user.entity';

/**
 * 유저 데이터를 JSON 형태로 변환시킨다. 이 때, 유저의 잔고량을 string으로 변환한다.
 * @param user
 * @returns
 */
export function serializeUserToJson(user: UserEntity): UserEntityJson {
  return {
    ...user,
    stockStatus:
      user.stockId == null
        ? null
        : serializeStockStatusToJson(
            getStockStatus(
              user.stockId,
              BigInt(user.stockAmount),
              BigInt(user.stockPrice),
              BigInt(user.stockCashPurchaseSum || 0),
            ),
          ),
    cash: user.cash.toString(),
  };
}

export function isUserThrowingDiceTossAllowedOrThrow(user: UserEntity) {
  if (
    user.canTossDiceAfter != null &&
    !user.isUserDiceTossForbidden &&
    user.canTossDiceAfter < new Date()
  ) {
    return true;
  }

  throw new ForbiddenException(`user dice toss forbidden; ${user.id}`);
}
