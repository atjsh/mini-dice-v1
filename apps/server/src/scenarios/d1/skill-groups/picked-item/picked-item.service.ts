import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { selectRandomItemFromList } from 'apps/server/src/common/random/random-item-from-array';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
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
  '꺠진 전구',
  '장독대',
  'TV',
  'A4 용지 100장',
];

const cashChangeEventValues: DynamicValueEventCase<PickedItemEventEnum>[] = [
  {
    causeName: PickedItemEventEnum.MADE_PROFIT,
    value: {
      from: 10000,
      to: 20000,
    },
    weight: 0.4,
  },
  {
    causeName: PickedItemEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.6,
  },
];

@Injectable()
export class PickedItemService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<PickedItemEventEnum>(
      cashChangeEventValues,
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case PickedItemEventEnum.MADE_PROFIT:
        await this.userRepository.changeUserCash(
          props.userId,
          cashChangeEvent.value,
        );
      case PickedItemEventEnum.NO_PROFIT:
        break;
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent, item: selectRandomItemFromList(items) };
  }
}
