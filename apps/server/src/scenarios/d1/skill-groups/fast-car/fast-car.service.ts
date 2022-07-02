import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { DiceTossService } from 'apps/server/src/dice-toss/dice-toss.service';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserService } from 'apps/server/src/user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum FastCarEventEnum {
  NO_PROFIT = 'no_profit',
  LOSE_MONEY = 'lose_money',
}

const cashChangeEventValues: DynamicValueEventCase<FastCarEventEnum>[] = [
  {
    causeName: FastCarEventEnum.LOSE_MONEY,
    value: {
      from: 2000,
      to: 30000,
    },
    weight: 0.9,
  },
  {
    causeName: FastCarEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.1,
  },
];

@Injectable()
export class FastCarService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<FastCarEventEnum>(
      cashChangeEventValues,
    );

    if (cashChangeEvent.value != 0) {
      await this.userService.changeUserCash(
        props.userId,
        -cashChangeEvent.value,
      );
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return cashChangeEvent;
  }
}
