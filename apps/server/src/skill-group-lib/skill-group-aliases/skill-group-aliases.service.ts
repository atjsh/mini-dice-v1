import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable } from '@nestjs/common';
import type { SkillRouteType } from '@packages/scenario-routing';
import {
  SkillGroupMetadataKey,
  getSkillGroupPath,
} from '@packages/scenario-routing';
import type { SCENARIO_NAMES } from '../../scenarios/scenarios.constants';
import type { SkillGroupController } from '../skill-group-controller-factory';

const cacheKey = 'scenarios:map:';

export type SkillGroupAliasesType = {
  skillRoute: SkillRouteType;
  alias: string;
}[];

@Injectable()
export class SkillGroupAliasesService {
  constructor(private discoveryService: DiscoveryService) {}

  private async setSkillGroupAliasesToCache(
    scenarioRoutes: SkillRouteType[],
    scenarioName: (typeof SCENARIO_NAMES)[keyof typeof SCENARIO_NAMES],
  ): Promise<SkillGroupAliasesType> {
    const skillGroupAliases = await Promise.all(
      scenarioRoutes.map(async (skillRoute: SkillRouteType) => {
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
          alias: `${await instance.getSkillGroupAlias()}`,
        };
      }),
    );

    return skillGroupAliases;
  }

  public async getSkillGroupAliases(
    scenarioRoutes: SkillRouteType[],
    scenarioName: (typeof SCENARIO_NAMES)[keyof typeof SCENARIO_NAMES],
  ): Promise<SkillGroupAliasesType> {
    return this.setSkillGroupAliasesToCache(scenarioRoutes, scenarioName);
  }
}
