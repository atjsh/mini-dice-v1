import { Injectable } from '@nestjs/common';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import {
  calcRandomCashChangeEvent,
  selectEventCaseRandomly,
} from '../../../../common/random/event-case-processing';
import { selectRandomItemFromList } from '../../../../common/random/random-item-from-array';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum PROFIT_STATUS {
  MADE_PROFIT = 'made_profit',
  LOST_PROFIT = 'lost_profit',
  NO_PROFIT = 'no_profit',
}

const nightFoods = [
  '치킨',
  '피자',
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
  '떡볶이',
  '컵라면',
  '물',
  '군만두',
  '타코야끼',
];

const cashChangeEventValues: DynamicValueEventCase[] = [
  {
    causeName: 'ff',
    value: {
      from: 1000,
      to: 50000,
    },
    weight: 1,
  },
];

@Injectable()
export class NightFoodService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  private getRandomEventAndFood() {
    return {
      foodName: selectRandomItemFromList(nightFoods),
      changingAmount: calcRandomCashChangeEvent(cashChangeEventValues).value,
    };
  }

  private async madeProfit(props: SkillServiceProps) {
    const eventResult = this.getRandomEventAndFood();
    await this.userService.changeUserCash(
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
    await this.userService.changeUserCash(
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
        weight: 0.7,
      },
      {
        causeName: PROFIT_STATUS.LOST_PROFIT,
        weight: 0.1,
      },
      {
        causeName: PROFIT_STATUS.NO_PROFIT,
        weight: 0.2,
      },
    ]).causeName;

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

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
