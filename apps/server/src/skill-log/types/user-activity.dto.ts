import { ApiProperty } from '@nestjs/swagger';
import { StockPriceChangeResult } from '../../scenarios/d1/common/stock/stock.service';

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

  @ApiProperty({ type: Object })
  params: T;
}

export type UserActivityType =
  | DiceUserActivity
  | InteractionUserActivity
  | GameStartUserAcitvity;
