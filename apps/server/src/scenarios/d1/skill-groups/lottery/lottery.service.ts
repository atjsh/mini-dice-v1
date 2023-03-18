import { Injectable } from '@nestjs/common';
import {
  DynamicValueEventCase,
  calcRandomCashChangeEvent,
} from '../../../../common/random/event-case-processing';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum LotteryEventEnum {
  MADE_PROFIT = 'made_profit',
  NO_PROFIT = 'no_profit',
}

const cashChangeEventValues: DynamicValueEventCase<LotteryEventEnum>[] = [
  {
    causeName: LotteryEventEnum.MADE_PROFIT,
    value: {
      from: 20000,
      to: 100000,
    },
    weight: 0.5,
  },
  {
    causeName: LotteryEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.5,
  },
];

@Injectable()
export class LotteryService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<LotteryEventEnum>(
      cashChangeEventValues,
    );

    if (cashChangeEvent.value != 0) {
      await this.userService.changeUserCash(
        props.userId,
        cashChangeEvent.value,
      );
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return cashChangeEvent;
  }
}
