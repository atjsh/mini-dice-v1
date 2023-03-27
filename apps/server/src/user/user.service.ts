import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { SkillRouteType } from '@packages/scenario-routing';
import { getSkillRoutePath } from '@packages/scenario-routing';
import type { CompleteSignupUserDto, UserIdType } from '@packages/shared-types';
import * as _ from 'lodash';
import type { Repository } from 'typeorm';
import { getRandomInteger } from '../common/random/random-number';
import { getRandomString } from '../common/random/random-string';
import { UserEntity } from './entity/user.entity';

function getCacheKey(userId: UserIdType) {
  return 'user:' + userId;
}

const CACHE_DURATION_MS = 1000 * 60 * 60 * 24;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private async isUserCallingSkillAllowed(
    user: UserEntity,
    callingSkillRoute: SkillRouteType,
  ) {
    return user.submitAllowedMapStop
      ?.split(',')
      .includes(getSkillRoutePath(callingSkillRoute));
  }

  /**
   * 유저를 찾고 캐시한다.
   */
  async findUserWithCache(userId: UserIdType): Promise<UserEntity> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
      cache: {
        id: getCacheKey(userId),
        milliseconds: CACHE_DURATION_MS,
      },
    });

    return {
      ...user,
      canTossDiceAfter: user.canTossDiceAfter
        ? new Date(user.canTossDiceAfter)
        : null,
      cash: BigInt(user.cash),
      stockPrice: BigInt(user.stockPrice),
      stockAmount: BigInt(user.stockAmount),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      stockCashPurchaseSum:
        user.stockCashPurchaseSum != null
          ? BigInt(user.stockCashPurchaseSum)
          : BigInt(0),
    } as UserEntity;
  }

  /**
   * 유저를 새로 회원가입 처리한다.
   * 이 떄, 유저는 회원가입이 완료되지 않은 상태로써 저장시킨다.
   * 유저는 추가적인 절차를 거친 후에 회원가입을 완료할 수 있다.
   * @param createUser
   * @returns
   */
  async signUpNewUser(
    createUser: Pick<UserEntity, 'authProvider' | 'signupCompleted'> &
      Partial<Pick<UserEntity, 'username' | 'email' | 'countryCode3'>>,
  ) {
    return await this.userRepository.save(
      this.userRepository.create({
        cash: BigInt(1000),
        username: !_.isEmpty(createUser.username)
          ? createUser.username
          : `유저${getRandomInteger(10000000000, 99999999999)}${getRandomString(
              4,
            )}`,
        email: createUser.email,
        authProvider: createUser.authProvider,
        submitAllowedMapStop: null,
        isUserDiceTossForbidden: false,
        canTossDiceAfter: new Date(
          new Date().setHours(new Date().getHours() - 1),
        ),
        countryCode3: createUser.countryCode3 ?? 'USA',
        signupCompleted: createUser.signupCompleted,
      }),
    );
  }

  /**
   * 유저의 데이터 중 일부를 업데이트한다.
   * @param userId
   * @param partialUserDto
   * @returns
   */
  async partialUpdateUser(
    userId: UserIdType,
    partialUserDto: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.userRepository.manager.connection.queryResultCache?.remove([
      getCacheKey(userId),
    ]);
    return await this.userRepository.save(
      _.omitBy(
        {
          ...partialUserDto,
          cash: partialUserDto.cash
            ? partialUserDto.cash < BigInt(0)
              ? BigInt(0)
              : partialUserDto.cash
            : undefined,
          id: userId,
        },
        _.isUndefined,
      ),
    );
  }

  /**
   * 유저를 회원가입 완료처리한다.
   */
  async completeSignup(
    userId: UserIdType,
    { countryCode3, username }: CompleteSignupUserDto,
  ) {
    return await this.partialUpdateUser(userId, {
      countryCode3,
      username: !_.isEmpty(username)
        ? username
        : `유저${getRandomInteger(10000000000, 99999999999)}${getRandomString(
            4,
          )}`,
      signupCompleted: true,
    });
  }

  /**
   * 유저의 현금 잔고량을 cashDifference만큼 변화시킨다.
   */
  async changeUserCash(
    userId: UserIdType,
    cashDifference: bigint | number,
    userOriginalCash?: bigint,
  ) {
    if (userOriginalCash) {
      return await this.partialUpdateUser(userId, {
        cash: BigInt(userOriginalCash) + BigInt(cashDifference),
      });
    }

    const user = await this.findUserWithCache(userId);
    return await this.partialUpdateUser(userId, {
      cash: BigInt(user.cash) + BigInt(cashDifference),
    });
  }

  async setUserAllowedSkillRoute(
    userId: UserIdType,
    allowedSkillRouteOrNull: SkillRouteType | SkillRouteType[],
    isUserDiceTossForbidden: boolean,
  ) {
    return await this.partialUpdateUser(userId, {
      submitAllowedMapStop: Array.isArray(allowedSkillRouteOrNull)
        ? allowedSkillRouteOrNull.map(getSkillRoutePath).join(',')
        : getSkillRoutePath(allowedSkillRouteOrNull),
      isUserDiceTossForbidden,
    });
  }

  /**
   * 유저를 게임에서 제외 처리한다.
   * @param userId
   * @returns
   */
  async terminateUser(userId: UserIdType) {
    return await this.partialUpdateUser(userId, {
      isTerminated: true,
      isUserDiceTossForbidden: true,
      submitAllowedMapStop: null,
    });
  }

  async isUserCallingSkillAllowedOrThrow(
    userId: UserIdType,
    callingSkillRoute: SkillRouteType,
  ): Promise<boolean> {
    const user = await this.findUserWithCache(userId);

    if (!(await this.isUserCallingSkillAllowed(user, callingSkillRoute))) {
      throw new ForbiddenException(
        `${JSON.stringify(user.submitAllowedMapStop)} not in ${JSON.stringify(
          callingSkillRoute,
        )} || ${JSON.stringify(
          user.submitAllowedMapStop,
        )} not in ${JSON.stringify(callingSkillRoute)}`,
      );
    }

    return true;
  }
}
