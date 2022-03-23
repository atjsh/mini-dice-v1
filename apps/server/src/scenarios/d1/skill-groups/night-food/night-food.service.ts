import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
  selectEventCaseRandomly,
} from 'apps/server/src/common/random/event-case-processing';
import { selectRandomItemFromList } from 'apps/server/src/common/random/random-item-from-array';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';

export enum PROFIT_STATUS {
  MADE_PROFIT = 'made_profit',
  LOST_PROFIT = 'lost_profit',
  NO_PROFIT = 'no_profit',
}

const nightFoods = [
  '치킨피자',
  '햄버거',
  '수육',
  '아몬드',
  '족발',
  '라면',
  '오코노미야키',
  '강정',
  '삼겹살',
  '돼지갈비',
  '탕수육',
  '닭발',
  '곱창',
];

const cashChangeEventValues: DynamicValueEventCase[] = [
  {
    causeName: 'ff',
    value: {
      from: 1000,
      to: 25000,
    },
    weight: 1,
  },
];

@Injectable()
export class NightFoodService {
  constructor(private userRepository: UserRepository) {}

  private getRandomEventAndFood() {
    return {
      foodName: selectRandomItemFromList(nightFoods),
      changingAmount: calcRandomCashChangeEvent(cashChangeEventValues).value,
    };
  }

  private async madeProfit(props: SkillServiceProps) {
    const eventResult = this.getRandomEventAndFood();
    await this.userRepository.changeUserCash(
      props.userId,
      eventResult.changingAmount,
    );
    return {
      foodDetail: eventResult,
      profitStatus: PROFIT_STATUS.MADE_PROFIT,
    };
  }

  private async lostProfit(props: SkillServiceProps) {
    const eventResult = this.getRandomEventAndFood();
    await this.userRepository.changeUserCash(
      props.userId,
      -eventResult.changingAmount,
    );
    return {
      foodDetail: eventResult,
      profitStatus: PROFIT_STATUS.LOST_PROFIT,
    };
  }

  private async noProfit() {
    return {
      foodDetail: {
        foodName: selectRandomItemFromList(nightFoods),
        changingAmount: 0,
      },
      profitStatus: PROFIT_STATUS.NO_PROFIT,
    };
  }

  async index(props: SkillServiceProps) {
    const event = selectEventCaseRandomly([
      {
        causeName: PROFIT_STATUS.MADE_PROFIT,
        weight: 0.5,
      },
      {
        causeName: PROFIT_STATUS.LOST_PROFIT,
        weight: 0.3,
      },
      {
        causeName: PROFIT_STATUS.NO_PROFIT,
        weight: 0.2,
      },
    ]).causeName;

    switch (event) {
      case PROFIT_STATUS.MADE_PROFIT:
        return this.madeProfit(props);
      case PROFIT_STATUS.LOST_PROFIT:
        return this.lostProfit(props);
      case PROFIT_STATUS.NO_PROFIT:
        return this.noProfit();
    }
  }
}
