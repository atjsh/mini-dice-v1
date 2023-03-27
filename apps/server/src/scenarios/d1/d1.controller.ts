import { Controller, Get } from '@nestjs/common';
import {
  SkillGroupAliasesService,
  type SkillGroupAliasesType,
} from '../../skill-group-lib/skill-group-aliases/skill-group-aliases.service';
import { SCENARIO_NAMES } from '../scenarios.constants';
import { OrderedD1ScenarioRoutes } from './routes';

@Controller('scenarios/d1')
export class D1Controller {
  constructor(private skillGroupAliasesService: SkillGroupAliasesService) {}

  @Get('map')
  async getAliases(): Promise<SkillGroupAliasesType> {
    return this.skillGroupAliasesService.getSkillGroupAliases(
      OrderedD1ScenarioRoutes,
      SCENARIO_NAMES.D1,
    );
  }
}
