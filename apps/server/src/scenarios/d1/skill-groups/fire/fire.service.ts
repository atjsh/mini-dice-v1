import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { getRandomInteger } from 'apps/server/src/common/random/random-number';
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
      from: 1,
      to: 3,
    },
    weight: 0.4,
  },
  {
    causeName: FireEventEnum.LOSE_MONEY,
    value: {
      from: 4,
      to: 7,
    },
    weight: 0.04,
  },

  {
    causeName: FireEventEnum.LOSE_MONEY,
    value: {
      from: 7,
      to: 10,
    },
    weight: 0.03,
  },
  {
    causeName: FireEventEnum.LOSE_MONEY,
    value: {
      from: 10,
      to: 33,
    },
    weight: 0.03,
  },
  {
    causeName: FireEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.5,
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
    console.log(cashChangeEvent);
    switch (cashChangeEvent.eventCase.causeName) {
      case FireEventEnum.LOSE_MONEY:
        const cash = (await this.userRepository.findUserWithCache(props.userId))
          .cash;
        const losing =
          (BigInt(cashChangeEvent.value) * BigInt(cash)) / BigInt(100);
        // if (losing > 500000) {
        //   const reducedLosing = getRandomInteger(50000, 100000);
        //   await this.userRepository.changeUserCash(
        //     props.userId,
        //     -reducedLosing,
        //   );
        //   return {
        //     losing: String(reducedLosing),
        //     eventCase: cashChangeEvent.eventCase.causeName,
        //   };
        // } else {

        // }
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
