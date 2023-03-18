export interface StockPriceChangeResult {
  changedStockPrice: bigint;
  stockPriceDifference: bigint;
  forcedSoldCash: false | bigint;
}

export interface UserActivityInterface {
  type: string;
}

export class GameStartUserAcitvity implements UserActivityInterface {
  type: 'gameStart';
}

export class DiceUserActivity implements UserActivityInterface {
  type: 'dice';

  diceResult: number[];

  stockPriceChange?: StockPriceChangeResult;
}

export class InteractionUserActivity<T = Record<string, any>>
  implements UserActivityInterface
{
  type: 'interaction';

  params: T;
}

export type UserActivityType =
  | DiceUserActivity
  | InteractionUserActivity
  | GameStartUserAcitvity;
