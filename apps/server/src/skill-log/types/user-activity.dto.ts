import { ApiProperty } from '@nestjs/swagger';

export interface UserActivityInterface {
  type: string;
}

export class GameStartUserAcitvity implements UserActivityInterface {
  type: 'gameStart';
}

export class DiceUserActivity implements UserActivityInterface {
  type: 'dice';

  diceResult: number[];

  stockChangeAmount?: number;
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
