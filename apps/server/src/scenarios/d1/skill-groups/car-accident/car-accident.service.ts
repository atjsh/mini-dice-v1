import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
  selectEventCaseRandomly,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-service-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';

@Injectable()
export class CarAccidentService {
  constructor(private readonly userRepository: UserRepository) {}
  private safe() {
    return { accident: 'safe', cacheDeclineAmount: 0 } as const;
  }

  private async accident(props: SkillServiceProps) {
    const accidents: DynamicValueEventCase[] = [
      {
        causeName: '다리',
        weight: 0.16,
        value: {
          from: 3000,
          to: 8000,
        },
      },
      {
        causeName: '귀',
        weight: 0.16,
        value: {
          from: 500,
          to: 10000,
        },
      },
      {
        causeName: '팔',
        weight: 0.16,
        value: {
          from: 14000,
          to: 33000,
        },
      },
      {
        causeName: '거... 거기',
        weight: 0.16,
        value: {
          from: 10000,
          to: 40000,
        },
      },
      {
        causeName: '손톱',
        weight: 0.16,
        value: {
          from: 10000,
          to: 30000,
        },
      },
      {
        causeName: '눈',
        weight: 0.16,
        value: {
          from: 2000,
          to: 100000,
        },
      },
    ];

    const accident = calcRandomCashChangeEvent(accidents);
    const { value: cacheDeclineAmount } = accident;

    await this.userRepository.changeUserCash(props.userId, -cacheDeclineAmount);

    return {
      accident: accident.eventCase.causeName,
      cacheDeclineAmount,
    };
  }

  public index(props: SkillServiceProps) {
    enum SAFE_OR_ACCIDENT {
      SAFE = 'safe',
      ACCIDENT = 'accident',
    }

    return selectEventCaseRandomly([
      {
        causeName: SAFE_OR_ACCIDENT.SAFE,
        weight: 0.1,
      },
      {
        causeName: SAFE_OR_ACCIDENT.ACCIDENT,
        weight: 0.8,
      },
    ]).causeName == SAFE_OR_ACCIDENT.SAFE
      ? this.safe()
      : this.accident(props);
  }
}
