import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getMaxStockBuyableAmount,
  getStockStatus,
  serializeStockStatusToJson,
  StockIdType,
  StockInitialData,
} from '@packages/shared-types';
import {
  SkillServiceProps,
  SkillService,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
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
    private userRepository: UserRepository,
    private commonStockService: CommonStockService,
  ) {}
  async index(props: SkillServiceProps) {
    const buyableStatus = await this.commonStockService.getStockBuyableStatus(
      props.userId,
    );

    const { cash, stockId, stockAmount, stockPrice } =
      await this.userRepository.findOneOrFail(props.userId);

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
      false,
    );

    if (buyableStatus == StockOwningStatusEnum.BUYABLE) {
      await this.userRepository.setUserAllowedSkillRoute(
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
      await this.userRepository.setUserAllowedSkillRoute(
        props.userId,
        D1ScenarioRoutes.skillGroups.stock.skills.sell,
        false,
      );

      return {
        buyable: buyableStatus,
        status: serializeStockStatusToJson(
          getStockStatus(stockId!, stockAmount, stockPrice),
        ),
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
    if (result == StockOwningStatusEnum.SELLABLE) {
      throw new ForbiddenException('cannot buy stock; already owned');
    }
    if (result == StockOwningStatusEnum.NOT_ENOUGH_MONEY) {
      throw new ForbiddenException('cannot buy stock; not enough money');
    }

    return {
      stockName: result.stockInitialData.stockName,
      stockAmount: String(result.stockAmount),
    };
  }

  async sell(props: SkillServiceProps) {
    const result = await this.commonStockService.sellStock(props.userId);
    if (result == StockOwningStatusEnum.BUYABLE) {
      throw new ForbiddenException('cannot sell stock; not owning stocks');
    }
    return result;
  }
}
