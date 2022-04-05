import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  StockBuyableByUserEnum,
  StockIdType,
  StockStatus,
  StockStatusJson,
} from '@packages/shared-types';
import { UserRepository } from './user.repository';

// export enum StockIdEnum {
//   'MHRD' = 1,
//   'BPPL' = 2,
//   'MIDI' = 3,
//   'GGPL' = 4,
// }

type StockInitalDataType = {
  id: StockIdType;
  stockName: string;
  stockTicker: string;
  stockStartingPrice: bigint;
  stockRisingPrice: bigint;
  stockFallingPrice: bigint;
};

const StockInitialData: StockInitalDataType[] = [
  {
    id: 1,
    stockName: '미디',
    stockTicker: 'MIDI',
    stockStartingPrice: BigInt(1000),
    stockRisingPrice: BigInt(110),
    stockFallingPrice: BigInt(100),
  },
  {
    id: 2,
    stockName: '배플',
    stockTicker: 'BPPL',
    stockStartingPrice: BigInt(10000),
    stockRisingPrice: BigInt(3500),
    stockFallingPrice: BigInt(3300),
  },
  {
    id: 3,
    stockName: '마이크로하드',
    stockTicker: 'MHRD',
    stockStartingPrice: BigInt(100000),
    stockRisingPrice: BigInt(75000),
    stockFallingPrice: BigInt(75000),
  },
  {
    id: 4,
    stockName: '구골플러스',
    stockTicker: 'GGPL',
    stockStartingPrice: BigInt(1000000),
    stockRisingPrice: BigInt(500),
    stockFallingPrice: BigInt(400),
  },
];

export type StockBuyableByUserStatus = {
  status: StockBuyableByUserEnum;
};

export function getStockStatus(
  stockId: StockIdType,
  stockAmount: StockStatus['stockAmount'],
  stockCurrentPrice: StockStatus['stockCurrentPrice'],
): StockStatus {
  const stockData = StockInitialData.find((stock) => stock.id === stockId);
  if (!stockData) {
    throw new ForbiddenException('Stock Not Found');
  }
  return {
    id: stockId,
    stockName: stockData.stockName,
    stockTicker: stockData.stockTicker,
    stockStartingPrice: stockData.stockStartingPrice,
    stockRisingPrice: stockData.stockRisingPrice,
    stockFallingPrice: stockData.stockFallingPrice,
    stockAmount,
    stockCurrentPrice,
  };
}

export function serializeStockStatusToJson(
  stockStatus: StockStatus,
): StockStatusJson {
  return {
    id: stockStatus.id,
    stockName: stockStatus.stockName,
    stockTicker: stockStatus.stockTicker,
    stockStartingPrice: stockStatus.stockStartingPrice.toString(),
    stockRisingPrice: stockStatus.stockRisingPrice.toString(),
    stockFallingPrice: stockStatus.stockFallingPrice.toString(),
    stockAmount: stockStatus.stockAmount.toString(),
    stockCurrentPrice: stockStatus.stockCurrentPrice.toString(),
  };
}

@Injectable()
export class StockService {
  constructor(private userRepository: UserRepository) {}
}
