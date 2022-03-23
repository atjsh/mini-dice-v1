import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable } from '@nestjs/common';
import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import { SkillMetadataKey } from '@packages/scenario-routing/constants';

@Injectable()
export class ScenarioRouteCallService {
  constructor(private discoveryService: DiscoveryService) {}

  async callSkillBySkill(skill: SkillRouteType) {
    const rawMethods =
      await this.discoveryService.providerMethodsWithMetaAtKey<SkillRouteType>(
        SkillMetadataKey,
      );

    const exactMethod = rawMethods.find(
      (method) => getSkillRoutePath(method.meta) == getSkillRoutePath(skill),
    );

    if (!exactMethod) {
      throw new Error(`Method ${getSkillRoutePath(skill)} not found`);
    }

    return exactMethod.discoveredMethod.handler.call(
      exactMethod.discoveredMethod.parentClass.instance,
    );
  }
}
