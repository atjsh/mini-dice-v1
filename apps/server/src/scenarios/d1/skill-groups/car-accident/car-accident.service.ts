import { Injectable } from '@nestjs/common';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import {
  calcRandomCashChangeEvent,
  selectEventCaseRandomly,
} from '../../../../common/random/event-case-processing';
import type { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import type { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

@Injectable()
export class CarAccidentService {
  constructor(
    private readonly userService: UserService,
    private diceTossService: DiceTossService,
  ) {}
  private safe() {
    return { accident: 'safe', cashDeclineAmount: 0 } as const;
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
        causeName: '손톱',
        weight: 0.36,
        value: {
          from: 1000,
          to: 3000,
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
    const { value: cashDeclineAmount } = accident;

    await this.userService.changeUserCash(props.userId, -cashDeclineAmount);

    return {
      accident: accident.eventCase.causeName,
      cashDeclineAmount: cashDeclineAmount,
    };
  }

  public async index(props: SkillServiceProps) {
    enum SAFE_OR_ACCIDENT {
      SAFE = 'safe',
      ACCIDENT = 'accident',
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

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
