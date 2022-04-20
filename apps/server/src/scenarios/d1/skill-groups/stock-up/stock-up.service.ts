import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
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
      from: 30,
      to: 60,
    },
    weight: 0.7,
  },
  {
    causeName: StockUpAmountEnum.TWO,
    value: {
      from: 60,
      to: 150,
    },
    weight: 0.3,
  },
];

@Injectable()
export class StockUpService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const { stockAmount, stockId, stockPrice } =
      await this.userRepository.findUserWithCache(props.userId);

    if (stockId) {
      const cashChangeEvent = calcRandomCashChangeEvent<StockUpAmountEnum>(
        cashChangeEventValues,
      );

      const stockRising =
        (BigInt(cashChangeEvent.value) * BigInt(stockPrice)) / BigInt(100);

      const risedStockPrice = stockRising + stockPrice;

      await this.userRepository.partialUpdateUser(props.userId, {
        stockPrice: risedStockPrice,
      });

      return {
        originalStockPrice: String(stockPrice),
        risedStockPrice: String(risedStockPrice),
        stockRising: String(stockRising),
        stockAmount: String(stockAmount),
        eventCase: cashChangeEvent.eventCase.causeName,
      };
    }
    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return null;
  }
}
