import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable } from '@nestjs/common';
import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import {
  LandEventDrawMetadataKey,
  LandEventsSummarizeMetadataKey,
  SkillDrawMetadataKey,
  SkillMetadataKey,
} from '@packages/scenario-routing/constants';
import { NotificationMessageType } from '@packages/shared-types';
import { SkillPropsType } from '../skill-group-lib/skill-service-lib';
import {
  LandEventDrawPropsType,
  LandEventsSummarizePropsType,
  LandEventsSummarizeResultType,
  SkillDrawPropsType,
} from '../skill-log/types/skill-draw-props.dto';
import { UserActivityType } from '../skill-log/types/user-activity.dto';

@Injectable()
export class ScenarioRouteCallService {
  constructor(private discoveryService: DiscoveryService) {}

  private async findSkillMethod(skillRoute: SkillRouteType, metadataKey: any) {
    const rawMethods =
      await this.discoveryService.providerMethodsWithMetaAtKey<string>(
        metadataKey,
      );

    const exactMethod = rawMethods.find(
      (method) => method.meta == getSkillRoutePath(skillRoute),
    );

    if (!exactMethod) {
      throw new Error(`Method ${getSkillRoutePath(skillRoute)} not found`);
    }
    return exactMethod;
  }

  public async canCallBySkill(
    skillRoute: SkillRouteType,
    metadataKey: any,
  ): Promise<boolean> {
    try {
      await this.findSkillMethod(skillRoute, metadataKey);
      return true;
    } catch {
      return false;
    }
  }

  private async callBySkill<ReturnType>(
    skillRoute: SkillRouteType,
    arg: any,
    metadataKey: any,
  ) {
    const exactMethod = await this.findSkillMethod(skillRoute, metadataKey);

    return exactMethod.discoveredMethod.handler.call(
      exactMethod.discoveredMethod.parentClass.instance,
      arg,
    ) as ReturnType;
  }

  public async callSkill<ReturnType>(
    skillRoute: SkillRouteType,
    skillProps: SkillPropsType<UserActivityType>,
  ) {
    return await this.callBySkill<ReturnType>(
      skillRoute,
      skillProps,
      SkillMetadataKey,
    );
  }

  public async callSkillDraw<ReturnType>(
    skillRoute: SkillRouteType,
    skillDrawProps: SkillDrawPropsType<UserActivityType, any>,
  ) {
    return await this.callBySkill<ReturnType>(
      skillRoute,
      skillDrawProps,
      SkillDrawMetadataKey,
    );
  }

  public async callLandEventDraw(
    land: SkillRouteType,
    landEventDrawProps: LandEventDrawPropsType<unknown>,
  ): Promise<NotificationMessageType> {
    return await this.callBySkill<NotificationMessageType>(
      land,
      landEventDrawProps,
      LandEventDrawMetadataKey,
    );
  }

  public async callLandEventsSummarize(
    land: SkillRouteType,
    landEventsSummarizeProps: LandEventsSummarizePropsType<unknown>,
  ): Promise<LandEventsSummarizeResultType> {
    return await this.callBySkill<LandEventsSummarizeResultType>(
      land,
      landEventsSummarizeProps,
      LandEventsSummarizeMetadataKey,
    );
  }
}
