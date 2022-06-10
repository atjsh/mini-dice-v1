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
  '3년만에 끝내는 머신러닝',
  '삼국지 2',
  '여덟 살 인생',
  '돼지고기 삼형제',
  '아프니까 환자다',
  '반투명 드래곤',
  '앵무새와 랩 배틀하는 법: 이론과 실제',
  '브레즈네프 독트린으로부터 페레스트로이카 소비에트의 몰락과 대두되는 민족주의를 통해 본 청계천 민물고기의 생태와 프라하의 봄 관광코스 개발을 서두르는 천민자본주의에 대항하는 새로운 세력',
  '코인 매매 1급 자격증 실전편',
  '토마스의 과학 시간',
  '별 하나 달 하나',
  '등대가 비추는 곳',
  '하늘을 올려다 봐야 목만 아프다',
  '모래언덕의 반대편',
  '브류마스터가 알려주는 31가지 홈브류잉 레시피',
  '싸구려 술 맛있게 마시기 백서',
  '네캔세일 : 술의 역사로 알아보는 맥주 고르기 팁',
  '30년 장기근속자가 알려주는 이직노하우',
  '사람에게 잡혀버린 치타',
  '고양이 말 알아듣는법',
  '지금 이 게임이 정말 당신의 인생이라 생각하시나요? -하하(下下)-',
  '인생의 무게 -하(下)-',
  '위험한 프로레슬링 기술 모음집',
  '솔개의 환골탈태 - 사이보그 솔개',
  '미켈란젤로 코드',
  '남궁형의 사생활',
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
