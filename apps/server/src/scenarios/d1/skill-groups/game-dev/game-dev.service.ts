import { Injectable } from '@nestjs/common';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import { calcRandomCashChangeEvent } from '../../../../common/random/event-case-processing';
import { selectRandomItemFromList } from '../../../../common/random/random-item-from-array';
import type { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import type { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum GameDevEventEnum {
  MADE_PROFIT = 'made_profit',
  LOST_PROFIT = 'lost_profit',
  NO_PROFIT = 'no_profit',
}

const games = [
  '돌',
  '리그 오브 더 히어로즈',
  '뱀파이어 서바이벌',
  '멀티플 포탈',
  '사이버 IQ 삼국지 건달',
  '저가요 오리인데요',
  '우주선 첩자 솎아내기',
  '라틴어 끝말잇기',
  '육목',
  '마리아파티 디럭스 7',
  '사이버펑크 윷놀이',
  '사이버펑크 그림그리기',
  '사이버펑크 트럭',
  '사이버펑크 VR',
  '사이버펑크 2.9.9',
  '사이버펑크 로봇',
  'GTVA',
  '히옷쓰',
  '우버왓치',
  '엘든롱',
  '던전앤캐릭터',
  '헬소드',
  '누구의마블',
  '라케일',
  '부릉스타즈',
  '마인카트',
  '와샌즈',
  '가을출타4',
  '하지마라 굶주림 다함께',
  '우리는 피하다 낙진을 네 번',
  '빛보다 빠른',
  '팩떠리어',
];

const cashChangeEventValues: DynamicValueEventCase<GameDevEventEnum>[] = [
  {
    causeName: GameDevEventEnum.MADE_PROFIT,
    value: {
      from: 50000,
      to: 200000,
    },
    weight: 0.3,
  },
  {
    causeName: GameDevEventEnum.MADE_PROFIT,
    value: {
      from: 10000,
      to: 50000,
    },
    weight: 0.4,
  },
  {
    causeName: GameDevEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.2,
  },
  {
    causeName: GameDevEventEnum.LOST_PROFIT,
    value: {
      from: 1000,
      to: 50000,
    },
    weight: 0.1,
  },
];

@Injectable()
export class GameDevService {
  constructor(
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<GameDevEventEnum>(
      cashChangeEventValues,
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case GameDevEventEnum.MADE_PROFIT:
        await this.userService.changeUserCash(
          props.userId,
          cashChangeEvent.value,
        );
      case GameDevEventEnum.NO_PROFIT:
        break;
      case GameDevEventEnum.LOST_PROFIT:
        await this.userService.changeUserCash(
          props.userId,
          -cashChangeEvent.value,
        );
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent, game: selectRandomItemFromList(games) };
  }
}
