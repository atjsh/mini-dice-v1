import { Injectable } from '@nestjs/common';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export const MAP_STARTER_REWARD_CASH = 100000;

@Injectable()
export class MapStarterService {
  constructor(private userRepository: UserRepository) {}

  public async index(props: SkillServiceProps) {
    const user = await this.userRepository.changeUserCash(
      props.userId,
      MAP_STARTER_REWARD_CASH,
    );

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return {
      currentCash: user.cash.toString(),
      rewarded_cash: MAP_STARTER_REWARD_CASH,
    };
  }
}
