import { Injectable } from '@nestjs/common';
import { DiceTossService } from 'apps/server/src/dice-toss/dice-toss.service';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserService } from 'apps/server/src/user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export const MAP_STARTER_REWARD_CASH = 100000;

@Injectable()
export class MapStarterService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  public async index(props: SkillServiceProps) {
    const user = await this.userService.changeUserCash(
      props.userId,
      MAP_STARTER_REWARD_CASH,
    );

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return {
      currentCash: user.cash.toString(),
      rewarded_cash: MAP_STARTER_REWARD_CASH,
    };
  }
}
