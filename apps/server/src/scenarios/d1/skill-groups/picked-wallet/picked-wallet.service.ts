import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum PickedWalletEventEnum {
  MADE_PROFIT = 'made_profit',
  NO_PROFIT = 'no_profit',
}

const cashChangeEventValues: DynamicValueEventCase<PickedWalletEventEnum>[] = [
  {
    causeName: PickedWalletEventEnum.MADE_PROFIT,
    value: {
      from: 10000,
      to: 80000,
    },
    weight: 0.8,
  },
  {
    causeName: PickedWalletEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.2,
  },
];

@Injectable()
export class PickedWalletService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<PickedWalletEventEnum>(
      cashChangeEventValues,
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case PickedWalletEventEnum.MADE_PROFIT:
        await this.userRepository.changeUserCash(
          props.userId,
          cashChangeEvent.value,
        );
      case PickedWalletEventEnum.NO_PROFIT:
        break;
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent };
  }
}
