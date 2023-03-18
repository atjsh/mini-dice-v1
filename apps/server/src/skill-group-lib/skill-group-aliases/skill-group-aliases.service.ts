import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  SkillGroupMetadataKey,
  SkillRouteType,
  getSkillGroupPath,
} from '@packages/scenario-routing';
import { Cache } from 'cache-manager';
import { SCENARIO_NAMES } from '../../scenarios/scenarios.constants';
import { SkillGroupController } from '../skill-group-controller-factory';

const cacheKey = 'scenarios:map:';

export type SkillGroupAliasesType = {
  skillRoute: SkillRouteType;
  alias: string;
}[];

@Injectable()
export class SkillGroupAliasesService {
  constructor(
    private discoveryService: DiscoveryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async setSkillGroupAliasesToCache(
    scenarioRoutes: SkillRouteType[],
    scenarioName: typeof SCENARIO_NAMES[keyof typeof SCENARIO_NAMES],
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

    await this.cacheManager.set(
      `${cacheKey}${scenarioName}`,
      skillGroupAliases,
    );

    return skillGroupAliases;
  }

  public async getSkillGroupAliases(
    scenarioRoutes: SkillRouteType[],
    scenarioName: typeof SCENARIO_NAMES[keyof typeof SCENARIO_NAMES],
  ): Promise<SkillGroupAliasesType> {
    // const cachedSkillGroupAliases =
    //   await this.cacheManager.get<SkillGroupAliasesType>(
    //     `${cacheKey}${scenarioName}`,
    //   );

    // if (cachedSkillGroupAliases) {
    //   return cachedSkillGroupAliases;
    // }

    return this.setSkillGroupAliasesToCache(scenarioRoutes, scenarioName);
  }

  public async invalidateSkillGroupAliasesCache(
    scenarioName: typeof SCENARIO_NAMES[keyof typeof SCENARIO_NAMES],
  ): Promise<void> {
    await this.cacheManager.del(`${cacheKey}${scenarioName}`);
  }
}
