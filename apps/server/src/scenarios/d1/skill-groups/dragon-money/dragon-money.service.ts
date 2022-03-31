import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum DragonMoneyEventEnum {
  MADE_PROFIT = 'made_profit',
  NO_PROFIT = 'no_profit',
}

const cashChangeEventValues: DynamicValueEventCase<DragonMoneyEventEnum>[] = [
  {
    causeName: DragonMoneyEventEnum.MADE_PROFIT,
    value: {
      from: 20000,
      to: 100000,
    },
    weight: 0.85,
  },
  {
    causeName: DragonMoneyEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.15,
  },
];

@Injectable()
export class DragonMoneyService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<DragonMoneyEventEnum>(
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
