import { CompleteSignupUserDto, UserIdType } from '@packages/shared-types';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * 유저를 새로 회원가입 처리한다.
   * 이 떄, 유저는 회원가입이 완료되지 않은 상태로써 저장시킨다.
   * 유저는 추가적인 절차를 거친 후에 회원가입을 완료할 수 있다.
   * @param createUser
   * @returns
   */
  async signUpNewUser(
    createUser: Pick<UserEntity, 'username' | 'authProvider'> &
      Partial<Pick<UserEntity, 'email'>>,
  ) {
    return await this.save(
      this.create({
        cash: BigInt(1000),
        username: createUser.username,
        email: createUser.email,
        submitAllowedMapStop: null,
        isUserDiceTossForbidden: false,
        canTossDiceAfter: new Date(),
        countryCode3: 'KOR',
        signupCompleted: false,
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
    return await this.save({
      ...partialUserDto,
      cash: partialUserDto.cash
        ? partialUserDto.cash < BigInt(0)
          ? BigInt(0)
          : partialUserDto.cash
        : undefined,
      id: userId,
    });
  }

  /**
   * 유저를 회원가입 완료처리한다.
   */
  async completeSignup({
    id: userId,
    countryCode3,
    username,
  }: CompleteSignupUserDto) {
    return await this.partialUpdateUser(userId, {
      countryCode3,
      username,
      signupCompleted: true,
    });
  }

  /**
   * 유저의 현금 잔고량을 cashDifference만큼 변화시킨다.
   */
  async changeUserCash(
    userId: UserIdType,
    userOriginalCash: bigint,
    cashDifference: bigint | number,
  ) {
    return await this.partialUpdateUser(userId, {
      cash: userOriginalCash + BigInt(cashDifference),
    });
  }

  /**
   * 유저가 주사위를 굴릴 수 있도록 조정한다.
   * @param userId
   * @param canTossDiceAt
   * @returns
   */
  async setUserCanTossDice(userId: UserIdType, canTossDiceAt: Date) {
    return await this.partialUpdateUser(userId, {
      isUserDiceTossForbidden: false,
      canTossDiceAfter: canTossDiceAt,
      submitAllowedMapStop: null,
    });
  }
}
