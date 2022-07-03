import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getStockInitialData,
  StockIdType,
  StockInitalDataType,
  StockInitialData,
  UserIdType,
} from '@packages/shared-types';
import { UserService } from '../../../../user/user.service';

export enum StockOwningStatusEnum {
  NOT_OWNING_STOCK = 0,
  OWNING_STOCK = 1,
  CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY = 2,
}

export type StockBuyableByUserStatus = {
  status: StockOwningStatusEnum;
};

export interface StockPriceChangeResult {
  changedStockPrice: bigint;
  stockPriceDifference: bigint;
  forcedSoldCash: false | bigint;
}

@Injectable()
export class CommonStockService {
  constructor(private userService: UserService) {}

  async getStockDatas(): Promise<StockInitalDataType[]> {
    return StockInitialData;
  }

  async getStockBuyableStatus(userId: UserIdType) {
    const user = await this.userService.findUserWithCache(userId);
    if (user.stockId == null) {
      return StockOwningStatusEnum.NOT_OWNING_STOCK;
    }

    const stockInitialData = getStockInitialData(user.stockId);
    if (stockInitialData == undefined) {
      throw new ForbiddenException('Stock Not Found');
    }

    if (BigInt(user.cash) < BigInt(user.stockPrice)) {
      return StockOwningStatusEnum.CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY;
    }

    return StockOwningStatusEnum.OWNING_STOCK;
  }

  async buyStock(
    userId: UserIdType,
    stockId: StockIdType,
    stockAmount: bigint,
  ) {
    if (!(stockAmount > 0)) {
      throw new ForbiddenException('not enough stock amount');
    }

    const stockInitialData = getStockInitialData(stockId);
    if (stockInitialData == undefined) {
      throw new ForbiddenException('Stock Not Found');
    }

    const user = await this.userService.findUserWithCache(userId);

    if (user.stockId != null) {
      return StockOwningStatusEnum.OWNING_STOCK;
    }

    if (
      BigInt(user.cash) <
      stockInitialData.stockStartingPrice * BigInt(stockAmount)
    ) {
      return StockOwningStatusEnum.CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY;
    }

    await this.userService.partialUpdateUser(userId, {
      cash:
        BigInt(user.cash) -
        stockInitialData.stockStartingPrice * BigInt(stockAmount),
      stockId,
      stockAmount,
      stockPrice: stockInitialData.stockStartingPrice,
      stockCashPurchaseSum:
        stockInitialData.stockStartingPrice * BigInt(stockAmount),
    });

    return {
      stockInitialData,
      stockAmount,
    };
  }

  async buyMoreStock(userId: UserIdType, addingStockAmount: bigint) {
    if (!(addingStockAmount > 0)) {
      throw new ForbiddenException('not enough stock amount');
    }
    const {
      stockId,
      stockPrice,
      cash,
      stockAmount: currentStockAmount,
      stockCashPurchaseSum: currentStockCashPurchaseSum,
    } = await this.userService.findUserWithCache(userId);

    if (stockId == null) {
      return StockOwningStatusEnum.NOT_OWNING_STOCK;
    }

    if (cash < stockPrice * addingStockAmount) {
      return StockOwningStatusEnum.CANNOT_BUY_STOCK_NOT_ENOUGH_MONEY;
    }

    await this.userService.partialUpdateUser(userId, {
      cash: cash - stockPrice * addingStockAmount,
      stockAmount: addingStockAmount + currentStockAmount,
      stockCashPurchaseSum: currentStockCashPurchaseSum
        ? currentStockCashPurchaseSum + stockPrice * addingStockAmount
        : undefined,
    });

    return {
      stockTotalAmount: addingStockAmount + currentStockAmount,
      stockBoughtAmount: addingStockAmount,
      stockPrice: stockPrice,
      stockName: getStockInitialData(stockId).stockName,
      stockTotalCash: stockPrice * (addingStockAmount + currentStockAmount),
    };
  }

  async sellStock(userId: UserIdType) {
    const user = await this.userService.findUserWithCache(userId);
    if (user.stockId == null) {
      return StockOwningStatusEnum.NOT_OWNING_STOCK;
    }

    const { stockName } = getStockInitialData(user.stockId);

    const userCash =
      BigInt(user.cash) + BigInt(user.stockAmount) * BigInt(user.stockPrice);

    await this.userService.partialUpdateUser(userId, {
      cash: userCash,
      stockId: null,
      stockAmount: BigInt(0),
      stockPrice: BigInt(0),
      stockCashPurchaseSum: null,
    });

    return {
      stockSold: BigInt(user.stockAmount) * BigInt(user.stockPrice),
      userCash,
      stockName,
    };
  }

  async changeStockPrice(
    userId: UserIdType,
    stockPriceDifference: bigint | number,
  ): Promise<StockPriceChangeResult> {
    const user = await this.userService.findUserWithCache(userId);
    const changedStockPrice =
      BigInt(user.stockPrice) + BigInt(stockPriceDifference);

    if (changedStockPrice < 1000) {
      const stockAmount = user.stockAmount;
      await this.userService.partialUpdateUser(userId, {
        stockPrice: changedStockPrice,
      });
      await this.sellStock(userId);

      return {
        changedStockPrice: changedStockPrice,
        stockPriceDifference: BigInt(stockPriceDifference),
        forcedSoldCash: changedStockPrice * stockAmount,
      };
    }

    await this.userService.partialUpdateUser(userId, {
      stockPrice: changedStockPrice,
    });

    return {
      changedStockPrice: changedStockPrice,
      stockPriceDifference: BigInt(stockPriceDifference),
      forcedSoldCash: false,
    };
  }
}
