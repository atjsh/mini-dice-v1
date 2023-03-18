import { Injectable } from '@nestjs/common';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import { calcRandomCashChangeEvent } from '../../../../common/random/event-case-processing';
import { selectRandomItemFromList } from '../../../../common/random/random-item-from-array';
import type { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import type { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum PickedItemEventEnum {
  MADE_PROFIT = 'made_profit',
  NO_PROFIT = 'no_profit',
}

const items = [
  '리그 오브 더 히어로즈 게임CD',
  '사이버펑크 윷놀이 게임CD',
  '핸드폰',
  '시계',
  '스피커',
  '피아노',
  '신발',
  '쓰레기 봉투',
  '키보드',
  '줄',
  '물병',
  '향수병',
  '깨진 전구',
  '장독대',
  'TV',
  'A4 용지 100장',
];

const cashChangeEventValues: DynamicValueEventCase<PickedItemEventEnum>[] = [
  {
    causeName: PickedItemEventEnum.MADE_PROFIT,
    value: {
      from: 10000,
      to: 80000,
    },
    weight: 0.7,
  },
  {
    causeName: PickedItemEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.3,
  },
];

@Injectable()
export class PickedItemService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<PickedItemEventEnum>(
      cashChangeEventValues,
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case PickedItemEventEnum.MADE_PROFIT:
        await this.userService.changeUserCash(
          props.userId,
          cashChangeEvent.value,
        );
      case PickedItemEventEnum.NO_PROFIT:
        break;
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent, item: selectRandomItemFromList(items) };
  }
}
