import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getMaxStockBuyableAmount,
  getStockStatus,
  serializeStockStatusToJson,
  StockIdType,
  StockInitialData,
} from '@packages/shared-types';
import { DiceTossService } from 'apps/server/src/dice-toss/dice-toss.service';
import {
  SkillServiceProps,
  SkillService,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserService } from 'apps/server/src/user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonStockService,
  StockOwningStatusEnum,
} from '../../common/stock/stock.service';
import { D1ScenarioRoutes } from '../../routes';

@Injectable()
export class StockService implements SkillService {
  constructor(
    private userService: UserService,
    private commonStockService: CommonStockService,
    private diceTossService: DiceTossService,
  ) {}
  async index(props: SkillServiceProps) {
    const buyableStatus = await this.commonStockService.getStockBuyableStatus(
      props.userId,
    );

    const { cash, stockId, stockAmount, stockPrice, stockCashPurchaseSum } =
      await this.userService.findUserWithCache(props.userId);

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
      false,
    );

    if (buyableStatus == StockOwningStatusEnum.NOT_OWNING_STOCK) {
      await this.userService.setUserAllowedSkillRoute(
        props.userId,
        D1ScenarioRoutes.skillGroups.stock.skills.buy,
        false,
      );

      return {
        buyable: buyableStatus,
        stocks: StockInitialData.map((stock) => ({
          ...stock,
          stockStartingPrice: String(stock.stockStartingPrice),
          stockRisingPrice: String(stock.stockRisingPrice),
          stockFallingPrice: String(stock.stockFallingPrice),
          maxBuyableAmount: String(
            getMaxStockBuyableAmount(stock.id, BigInt(cash)),
          ),
        })),
      };
    } else {
      await this.userService.setUserAllowedSkillRoute(
        props.userId,
        [
          D1ScenarioRoutes.skillGroups.stock.skills.sell,
          D1ScenarioRoutes.skillGroups.stock.skills.buyMore,
        ],
        false,
      );

      return {
        buyable: buyableStatus,
        status: serializeStockStatusToJson(
          getStockStatus(
            stockId!,
            stockAmount,
            stockPrice,
            stockCashPurchaseSum || BigInt(0),
          ),
        ),
        maxBuyableAmount: String(cash / stockPrice),
      };
    }
  }

  async buy(
    props: SkillServiceProps<{ amount: bigint; stockId: StockIdType }>,
  ) {
    const result = await this.commonStockService.buyStock(
      props.userId,
      props.stockId,
      props.amount,
    );
    if (result == StockOwningStatusEnum.OWNING_STOCK) {
      throw new ForbiddenException('cannot buy stock; already owned');
    }
    if (result == StockOwningStatusEnum.CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY) {
      throw new ForbiddenException('cannot buy stock; not enough money');
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1, true),
    );

    return {
      stockName: result.stockInitialData.stockName,
      stockAmount: String(result.stockAmount),
    };
  }

  async buyMore(props: SkillServiceProps<{ amount: bigint }>) {
    const result = await this.commonStockService.buyMoreStock(
      props.userId,
      props.amount,
    );
    if (result == StockOwningStatusEnum.NOT_OWNING_STOCK) {
      throw new ForbiddenException('cannot buy more stock; not owning stocks');
    }
    if (result == StockOwningStatusEnum.CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY) {
      throw new ForbiddenException('cannot buy more stock; not enough money');
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1, true),
    );

    return {
      stockName: result.stockName,
      stockPrice: result.stockPrice,
      stockBoughtAmount: String(result.stockBoughtAmount),
      stockTotalCash: result.stockTotalCash,
    };
  }

  async sell(props: SkillServiceProps) {
    const result = await this.commonStockService.sellStock(props.userId);
    if (result == StockOwningStatusEnum.NOT_OWNING_STOCK) {
      throw new ForbiddenException('cannot sell stock; not owning stocks');
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1, true),
    );
    return result;
  }
}
