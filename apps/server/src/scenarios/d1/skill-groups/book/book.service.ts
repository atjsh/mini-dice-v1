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

export enum BookEventEnum {
  MADE_PROFIT = 'made_profit',
  NO_PROFIT = 'no_profit',
}

// 실제 책을 기반으로 한 패러디된 책 이름들 목록
const books = [
  '일본식 도박 기계와 내 후손들의 삶',
  '이상한 의사',
  '3년만에 끝내는 머신러닝',
  '돈을 사라',
  '핸드폰운용기사',
  '삼국지 2',
  '뇌에 장치를 심은 체스 기사',
  '개미들의 이야기',
  '탄소노트',
  '아름다운 세계',
  '어린왕자 2',
  '마이 에스큐엘',
  '브이 포 에스코드',
  '드래곤 블럭',
  '세상에서 가장 빠른 고전 읽기',
];

const cashChangeEventValues: DynamicValueEventCase<BookEventEnum>[] = [
  {
    causeName: BookEventEnum.MADE_PROFIT,
    value: {
      from: 6000,
      to: 30000,
    },
    weight: 0.9,
  },
  {
    causeName: BookEventEnum.NO_PROFIT,
    value: 0,
    weight: 0.1,
  },
];

@Injectable()
export class BookService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent<BookEventEnum>(
      cashChangeEventValues,
    );

    if (cashChangeEvent.value != 0) {
      await this.userRepository.changeUserCash(
        props.userId,
        cashChangeEvent.value,
      );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return { cashChangeEvent, book: selectRandomItemFromList(books) };
  }
}
