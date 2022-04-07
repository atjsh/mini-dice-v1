export const StockId = [1, 2, 3, 4] as const;
export type StockIdType = typeof StockId[number];

export interface StockData {
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

export type StockInitalDataType = {
  id: StockIdType;
  stockName: string;
  stockTicker: string;
  stockStartingPrice: bigint;
  stockRisingPrice: bigint;
  stockFallingPrice: bigint;
};

export const StockInitialData: StockInitalDataType[] = [
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

export function getStockInitialData(id: StockIdType): StockInitalDataType {
  return StockInitialData.find((stock) => stock.id === id)!;
}

export function getStockStatus(
  stockId: StockIdType,
  stockAmount: StockStatus['stockAmount'],
  stockCurrentPrice: StockStatus['stockCurrentPrice'],
): StockStatus {
  const stockInitialData = StockInitialData.find(
    (stock) => stock.id === stockId,
  );
  if (!stockInitialData) {
    throw new Error('Stock Not Found');
  }
  return {
    id: stockId,
    stockName: stockInitialData.stockName,
    stockTicker: stockInitialData.stockTicker,
    stockStartingPrice: stockInitialData.stockStartingPrice,
    stockRisingPrice: stockInitialData.stockRisingPrice,
    stockFallingPrice: stockInitialData.stockFallingPrice,
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

export function getMaxStockBuyableAmount(
  stockId: StockIdType,
  userCash: bigint,
): bigint {
  const stockInitialData = StockInitialData.find(
    (stock) => stock.id === stockId,
  );
  if (!stockInitialData) {
    throw new Error('Stock Not Found');
  }

  return userCash / stockInitialData.stockStartingPrice;
}
