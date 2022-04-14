import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getStockInitialData,
  StockIdType,
  StockInitalDataType,
  StockInitialData,
  UserIdType,
} from '@packages/shared-types';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../../../../user/user.repository';

export enum StockOwningStatusEnum {
  BUYABLE,
  SELLABLE,
  NOT_ENOUGH_MONEY,
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
  constructor(private userRepository: UserRepository) {}

  async getStockDatas(): Promise<StockInitalDataType[]> {
    return StockInitialData;
  }

  async getStockBuyableStatus(userId: UserIdType) {
    const user = await this.userRepository.findUserWithCache(userId);
    if (user.stockId == null) {
      return StockOwningStatusEnum.BUYABLE;
    }
    return StockOwningStatusEnum.SELLABLE;
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

    return await this.userRepository.manager.transaction(
      async (transactionManager: EntityManager) => {
        console.log(userId);

        const user = await transactionManager
          .getCustomRepository(UserRepository)
          .findUserWithCache(userId);
        console.log(user);

        if (user.stockId != null) {
          return StockOwningStatusEnum.SELLABLE;
        }

        if (
          BigInt(user.cash) <
          stockInitialData.stockStartingPrice * BigInt(stockAmount)
        ) {
          return StockOwningStatusEnum.NOT_ENOUGH_MONEY;
        }

        await transactionManager
          .getCustomRepository(UserRepository)
          .partialUpdateUser(userId, {
            cash:
              BigInt(user.cash) -
              stockInitialData.stockStartingPrice * BigInt(stockAmount),
            stockId,
            stockAmount,
            stockPrice: stockInitialData.stockStartingPrice,
          });

        return {
          stockInitialData,
          stockAmount,
        };
      },
    );
  }

  async sellStock(userId: UserIdType) {
    return await this.userRepository.manager.transaction(
      async (transactionManager: EntityManager) => {
        const user = await transactionManager
          .getCustomRepository(UserRepository)
          .findUserWithCache(userId);
        if (user.stockId == null) {
          return StockOwningStatusEnum.BUYABLE;
        }

        const { stockName } = getStockInitialData(user.stockId);

        const userCash =
          BigInt(user.cash) +
          BigInt(user.stockAmount) * BigInt(user.stockPrice);

        await transactionManager
          .getCustomRepository(UserRepository)
          .partialUpdateUser(userId, {
            cash: userCash,
            stockId: null,
            stockAmount: BigInt(0),
            stockPrice: BigInt(0),
          });

        return {
          userCash,
          stockName,
        };
      },
    );
  }

  async changeStockPrice(
    userId: UserIdType,
    stockPriceDifference: bigint | number,
  ): Promise<StockPriceChangeResult> {
    const user = await this.userRepository.findUserWithCache(userId);
    const changedStockPrice =
      BigInt(user.stockPrice) + BigInt(stockPriceDifference);

    if (changedStockPrice < 1000) {
      const stockAmount = user.stockAmount;
      await this.userRepository.partialUpdateUser(userId, {
        stockPrice: changedStockPrice,
      });
      await this.sellStock(userId);

      return {
        changedStockPrice: changedStockPrice,
        stockPriceDifference: BigInt(stockPriceDifference),
        forcedSoldCash: changedStockPrice * stockAmount,
      };
    }

    await this.userRepository.partialUpdateUser(userId, {
      stockPrice: changedStockPrice,
    });

    return {
      changedStockPrice: changedStockPrice,
      stockPriceDifference: BigInt(stockPriceDifference),
      forcedSoldCash: false,
    };
  }
}
