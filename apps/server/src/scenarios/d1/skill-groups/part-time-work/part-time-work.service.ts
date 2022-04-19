import { Injectable } from '@nestjs/common';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

const cashChangeEventValues: DynamicValueEventCase[] = [
  {
    causeName: '',
    value: {
      from: 20000,
      to: 90000,
    },
    weight: 1,
  },
];

@Injectable()
export class PartTimeWorkService {
  constructor(private userRepository: UserRepository) {}

  async index(props: SkillServiceProps) {
    const cashChangeEvent = calcRandomCashChangeEvent(cashChangeEventValues);

    await this.userRepository.changeUserCash(
      props.userId,
      cashChangeEvent.value,
    );

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return cashChangeEvent;
  }
}
