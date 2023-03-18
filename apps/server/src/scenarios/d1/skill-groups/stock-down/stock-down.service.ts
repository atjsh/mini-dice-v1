import { Injectable } from '@nestjs/common';
import {
  DynamicValueEventCase,
  calcRandomCashChangeEvent,
} from '../../../../common/random/event-case-processing';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import { UserService } from '../../../../user/user.service';
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
    private userService: UserService,
    private commonStockService: CommonStockService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const { stockAmount, stockId, stockPrice } =
      await this.userService.findUserWithCache(props.userId);

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

      await this.diceTossService.setUserCanTossDice(
        props.userId,
        getUserCanTossDice(SCENARIO_NAMES.D1),
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
    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return null;
  }
}
