import { Injectable } from '@nestjs/common';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';

export const MAP_STARTER_REWARD_CASH = 10000;

@Injectable()
export class MapStarterService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 유저에게 10000원을 지급한다.
   */
  public async index(props: SkillServiceProps) {
    const user = await this.userRepository.changeUserCash(
      props.userId,
      MAP_STARTER_REWARD_CASH,
    );

    return {
      currentCash: user.cash.toString(),
      rewarded_cash: MAP_STARTER_REWARD_CASH,
    };
  }
}
