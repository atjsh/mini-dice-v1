import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
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
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<LotteryEventEnum>(
      cashChangeEventValues,
    );

    if (cashChangeEvent.value != 0) {
      await this.userRepository.changeUserCash(
        props.userId,
        cashChangeEvent.value,
      );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return cashChangeEvent;
  }
}
