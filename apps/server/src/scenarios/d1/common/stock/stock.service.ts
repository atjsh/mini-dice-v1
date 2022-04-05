import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  StockIdType,
  StockInitalDataType,
  StockInitialData,
  UserIdType,
} from '@packages/shared-types';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../../../user/entity/user.entity';
import { UserRepository } from '../../../../user/user.repository';

export enum StockBuyableByUserEnum {
  BUYABLE,
  ALREADY_OWNED,
  NOT_ENOUGH_MONEY,
}

export enum StockSellableByUserEnum {
  SELLABLE,
  NOT_ENOUGH_STOCK,
}

export type StockBuyableByUserStatus = {
  status: StockBuyableByUserEnum;
};

@Injectable()
export class CommonStockService {
  constructor(private userRepository: UserRepository) {}

  async getStockDatas(): Promise<StockInitalDataType[]> {
    return StockInitialData;
  }

  async getStockBuyableStatus(userId: UserIdType) {
    const user = await this.userRepository.findOneOrFail(userId);
    if (user.stockId == null) {
      return StockBuyableByUserEnum.BUYABLE;
    }
    return StockBuyableByUserEnum.ALREADY_OWNED;
  }

  async buyStock(
    userId: UserIdType,
    stockId: StockIdType,
    stockAmount: bigint,
  ) {
    await this.userRepository.manager.transaction(
      async (transactionManager: EntityManager) => {
        const user = await transactionManager.findOneOrFail<UserEntity>(userId);
        if (user.stockId != null) {
          return StockBuyableByUserEnum.ALREADY_OWNED;
        }

        const stockInitialData = StockInitialData.find(
          (stock) => stock.id === stockId,
        );
        if (stockInitialData == undefined) {
          throw new ForbiddenException('Stock Not Found');
        }

        if (
          BigInt(user.cash) <
          stockInitialData.stockStartingPrice * BigInt(stockAmount)
        ) {
          return StockBuyableByUserEnum.NOT_ENOUGH_MONEY;
        }

        await transactionManager.update(
          UserEntity,
          {
            id: userId,
          },
          {
            cash:
              BigInt(user.cash) -
              stockInitialData.stockStartingPrice * BigInt(stockAmount),
            stockId,
            stockAmount,
            stockPrice: stockInitialData.stockStartingPrice,
          },
        );
      },
    );

    return true;
  }

  async sellStock(userId: UserIdType) {
    await this.userRepository.manager.transaction(
      async (transactionManager: EntityManager) => {
        const user = await transactionManager.findOneOrFail<UserEntity>(userId);
        if (user.stockId == null) {
          return StockSellableByUserEnum.NOT_ENOUGH_STOCK;
        }

        await transactionManager.update(
          UserEntity,
          {
            id: userId,
          },
          {
            cash:
              BigInt(user.cash) +
              BigInt(user.stockAmount) * BigInt(user.stockPrice),
            stockId: null,
            stockAmount: BigInt(0),
            stockPrice: BigInt(0),
          },
        );
      },
    );

    return true;
  }
}
