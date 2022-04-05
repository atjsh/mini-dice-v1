import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  IndexSkillPropsType,
  Skill,
  SkillGroup,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { D1ScenarioRoutes } from '../../routes';
import { StockService } from './stock.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.stock)
export class StockSkillGroup implements SkillGroupController {
  constructor(private skillService: StockService) {}
  getSkillGroupAlias(): string | Promise<string> {
    return '주식';
  }

  @Skill(D1ScenarioRoutes.skillGroups.stock.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }
}
