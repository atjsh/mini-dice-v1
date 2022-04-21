import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import { CommonStockService } from '../../common/stock/stock.service';

export enum StockUpAmountEnum {
  ONE = 'one',
  TWO = 'two',
}

const cashChangeEventValues: DynamicValueEventCase<StockUpAmountEnum>[] = [
  {
    causeName: StockUpAmountEnum.ONE,
    value: {
      from: 5,
      to: 20,
    },
    weight: 0.6,
  },
  {
    causeName: StockUpAmountEnum.TWO,
    value: {
      from: 30,
      to: 50,
    },
    weight: 0.4,
  },
];

@Injectable()
export class StockDownService {
  constructor(
    private userRepository: UserRepository,
    private commonStockService: CommonStockService,
  ) {}

  async index(props: SkillServiceProps) {
    const { stockAmount, stockId, stockPrice } =
      await this.userRepository.findUserWithCache(props.userId);

    if (stockId) {
      const cashChangeEvent = calcRandomCashChangeEvent<StockUpAmountEnum>(
        cashChangeEventValues,
      );

      const stockFalling =
        (BigInt(cashChangeEvent.value) * BigInt(stockPrice)) / BigInt(100);

      const { forcedSoldCash, changedStockPrice } =
        await this.commonStockService.changeStockPrice(
          props.userId,
          -stockFalling,
        );

      return {
        originalStockPrice: String(stockPrice),
        falledStockPrice: String(changedStockPrice),
        stockFalling: String(stockFalling),
        stockAmount: String(stockAmount),
        eventCase: cashChangeEvent.eventCase.causeName,
        forcedSoldCash:
          forcedSoldCash != false ? String(forcedSoldCash) : false,
      };
    }
    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return null;
  }
}
