import { Injectable } from '@nestjs/common';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import { calcRandomCashChangeEvent } from '../../../../common/random/event-case-processing';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum StockUpAmountEnum {
  ONE = 'one',
  TWO = 'two',
}

const cashChangeEventValues: DynamicValueEventCase<StockUpAmountEnum>[] = [
  {
    causeName: StockUpAmountEnum.ONE,
    value: {
      from: 5,
      to: 30,
    },
    weight: 0.7,
  },
  {
    causeName: StockUpAmountEnum.TWO,
    value: {
      from: 50,
      to: 110,
    },
    weight: 0.3,
  },
];

@Injectable()
export class StockUpService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const { stockAmount, stockId, stockPrice } =
      await this.userService.findUserWithCache(props.userId);

    if (stockId) {
      const cashChangeEvent = calcRandomCashChangeEvent<StockUpAmountEnum>(
        cashChangeEventValues,
      );

      const stockRising =
        (BigInt(cashChangeEvent.value) * BigInt(stockPrice)) / BigInt(100);

      const risedStockPrice = stockRising + stockPrice;

      await this.userService.partialUpdateUser(props.userId, {
        stockPrice: risedStockPrice,
      });

      await this.diceTossService.setUserCanTossDice(
        props.userId,
        getUserCanTossDice(SCENARIO_NAMES.D1),
      );

      return {
        originalStockPrice: String(stockPrice),
        risedStockPrice: String(risedStockPrice),
        stockRising: String(stockRising),
        stockAmount: String(stockAmount),
        eventCase: cashChangeEvent.eventCase.causeName,
      };
    }
    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return null;
  }
}
