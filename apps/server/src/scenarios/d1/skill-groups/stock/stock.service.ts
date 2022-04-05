import { Injectable } from '@nestjs/common';
import {
  SkillServiceProps,
  SkillService,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';

@Injectable()
export class StockService implements SkillService {
  constructor(private userRepository: UserRepository) {}
  async index(props: SkillServiceProps) {
    return '';
  }
}
