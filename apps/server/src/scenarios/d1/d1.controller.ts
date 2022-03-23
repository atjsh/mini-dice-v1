import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Controller, Get } from '@nestjs/common';
import {
  getSkillGroupPath,
  getSkillRoutePath,
  SkillRouteType,
} from '@packages/scenario-routing';
import { SkillGroupMetadataKey } from '@packages/scenario-routing/constants';
import { SkillGroupController } from '../../skill-group-lib/skill-group-controller-factory';
import { OrderedD1ScenarioRoutes } from './routes';

@Controller('scenarios/d1')
export class D1Controller {
  constructor(private discoveryService: DiscoveryService) {}

  @Get('map')
  async getAliases() {
    return await Promise.all(
      OrderedD1ScenarioRoutes.map(async (skillRoute: SkillRouteType) => {
        const skillGroupPath = getSkillGroupPath(skillRoute);

        const rawInstances =
          await this.discoveryService.providersWithMetaAtKey<string>(
            SkillGroupMetadataKey,
          );

        const exactInstance = rawInstances.find(
          (method) => method.meta == skillGroupPath,
        );

        if (!exactInstance) {
          throw new Error(`Instance ${skillGroupPath} not found`);
        }

        const instance = exactInstance.discoveredClass
          .instance as SkillGroupController;

        return {
          skillRoute: skillRoute,
          skillRouteUrl: getSkillRoutePath(skillRoute),
          alias: `${await instance.getSkillGroupAlias()}칸`,
        };
      }),
    );
  }
}
