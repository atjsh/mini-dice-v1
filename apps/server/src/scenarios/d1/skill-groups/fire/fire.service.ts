import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum FireEventEnum {
  LOSE_MONEY = 'lose_money',
  NO_PROFIT = 'no_profit',
}

const cashChangeEventValues: DynamicValueEventCase<FireEventEnum>[] = [
  {
    causeName: FireEventEnum.LOSE_MONEY,
    value: {
      from: 10,
      to: 33,
    },
    weight: 0.9,
  },
  {
    causeName: FireEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.1,
  },
];

@Injectable()
export class FireService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<FireEventEnum>(
      cashChangeEventValues,
    );

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case FireEventEnum.LOSE_MONEY:
        const cash = (await this.userRepository.findUserWithCache(props.userId))
          .cash;
        const losing =
          (BigInt(cashChangeEvent.value) * BigInt(cash)) / BigInt(100);
        await this.userRepository.changeUserCash(props.userId, -losing);

        return {
          losing: String(losing),
          eventCase: cashChangeEvent.eventCase.causeName,
        };
      case FireEventEnum.NO_PROFIT:
        return {
          eventCase: cashChangeEvent.eventCase.causeName,
        };
    }
  }
}
