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

export enum GameDevEventEnum {
  MADE_PROFIT = 'made_profit',
  LOST_PROFIT = 'lost_profit',
  NO_PROFIT = 'no_profit',
}

const games = [
  '역전판사',
  '이상한 마을에서 퀴즈탐험',
  '돌',
  '빅다이스',
  '리그 오브 더 히어로즈',
  '이탈리안 플럼버',
  '뱀파이어 서바이벌',
  '멀티플 포탈',
  '사이버 IQ 삼국지 건달',
  '저가요 오리인데요',
  '우주선 첩자 솎아내기',
  '언텔드',
  '야채 다이스',
  '라틴어 끝말잇기',
  '육목',
  '마리아파티 디럭스 7',
  '링크',
  '사이버펑크 윷놀이',
  '사이버펑크 그림그리기',
  '사이버펑크 트럭',
  '사이버펑크 VR',
  '사이버펑크 2.9.9',
  '사이버펑크 로봇',
  '립버전즈',
  '색칠공부',
  '공주 옷입히기',
  '눈빛 보내기',
  '무서운 게임 0',
  'GTVA',
  '디아',
  '오오아오니',
  '암살자들',
  '소스트리',
  '깃 허브즈',
  '타입 타입 스크립트 모험',
  '팩토리 오 팩토리 오 팩토리',
  '게임 만들기',
];

const cashChangeEventValues: DynamicValueEventCase<GameDevEventEnum>[] = [
  {
    causeName: GameDevEventEnum.MADE_PROFIT,
    value: {
      from: 50000,
      to: 200000,
    },
    weight: 0.2,
  },
  {
    causeName: GameDevEventEnum.MADE_PROFIT,
    value: {
      from: 10000,
      to: 50000,
    },
    weight: 0.5,
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
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<GameDevEventEnum>(
      cashChangeEventValues,
    );
    switch (cashChangeEvent.eventCase.causeName) {
      case GameDevEventEnum.MADE_PROFIT:
        await this.userRepository.changeUserCash(
          props.userId,
          cashChangeEvent.value,
        );
      case GameDevEventEnum.NO_PROFIT:
        break;
      case GameDevEventEnum.LOST_PROFIT:
        await this.userRepository.changeUserCash(
          props.userId,
          -cashChangeEvent.value,
        );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent, game: selectRandomItemFromList(games) };
  }
}
