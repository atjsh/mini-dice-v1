export const StockId = [1, 2, 3, 4] as const;
export type StockIdType = typeof StockId[number];

export enum StockBuyableByUserEnum {
  BUYABLE,
  ALREADY_OWNED,
  NOT_ENOUGH_MONEY,
}

interface StockData {
  id: StockIdType;
  stockName: string;
  stockTicker: string;
  stockStartingPrice: bigint;
  stockRisingPrice: bigint;
  stockFallingPrice: bigint;
}

export interface StockStatus {
  id: StockIdType;
  stockName: StockData['stockName'];
  stockTicker: StockData['stockTicker'];
  stockStartingPrice: StockData['stockStartingPrice'];
  stockRisingPrice: StockData['stockRisingPrice'];
  stockFallingPrice: StockData['stockFallingPrice'];
  stockAmount: bigint;
  stockCurrentPrice: bigint;
}

export type StockStatusJson = Omit<
  StockStatus,
  | 'stockRisingPrice'
  | 'stockFallingPrice'
  | 'stockAmount'
  | 'stockCurrentPrice'
  | 'stockStartingPrice'
> & {
  stockRisingPrice: string;
  stockFallingPrice: string;
  stockAmount: string;
  stockCurrentPrice: string;
  stockStartingPrice: string;
};
