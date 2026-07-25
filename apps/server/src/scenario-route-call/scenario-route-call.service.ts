import { DiscoveryService, type MetaKey } from '@golevelup/nestjs-discovery';
import { Injectable } from '@nestjs/common';
import type { SkillRouteType } from '@packages/scenario-routing';
import {
  getSkillRoutePath,
  LandEventDrawMetadataKey,
  LandEventsSummarizeMetadataKey,
  SkillDrawMetadataKey,
  SkillMetadataKey,
} from '@packages/scenario-routing';
import type { NotificationMessageType } from '@packages/shared-types';
import type { SkillPropsType } from '../skill-group-lib/skill-service-lib';
import type {
  LandEventDrawPropsType,
  LandEventsSummarizePropsType,
  LandEventsSummarizeResultType,
  SkillDrawPropsType,
} from '../skill-log/types/skill-draw-props.dto';
import type { UserActivityType } from '../skill-log/types/user-activity.dto';

@Injectable()
export class ScenarioRouteCallService {
  constructor(private discoveryService: DiscoveryService) {}

  private async findSkillMethod(
    skillRoute: SkillRouteType,
    metadataKey: MetaKey,
  ) {
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
    metadataKey: MetaKey,
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
    arg: unknown,
    metadataKey: MetaKey,
  ): Promise<ReturnType> {
    const exactMethod = await this.findSkillMethod(skillRoute, metadataKey);
    const handler: unknown = exactMethod.discoveredMethod.handler;

    if (typeof handler !== 'function') {
      throw new TypeError(`Method ${getSkillRoutePath(skillRoute)} is invalid`);
    }

    const result: unknown = handler.call(
      exactMethod.discoveredMethod.parentClass.instance,
      arg,
    );

    return (await result) as ReturnType;
  }

  public async callSkill<ReturnType>(
    skillRoute: SkillRouteType,
    skillProps: SkillPropsType<UserActivityType>,
  ): Promise<ReturnType> {
    return this.callBySkill<ReturnType>(
      skillRoute,
      skillProps,
      SkillMetadataKey,
    );
  }

  public async callSkillDraw<ReturnType>(
    skillRoute: SkillRouteType,
    skillDrawProps: SkillDrawPropsType<UserActivityType, unknown>,
  ): Promise<ReturnType> {
    return this.callBySkill<ReturnType>(
      skillRoute,
      skillDrawProps,
      SkillDrawMetadataKey,
    );
  }

  public async callLandEventDraw(
    land: SkillRouteType,
    landEventDrawProps: LandEventDrawPropsType<unknown>,
  ): Promise<NotificationMessageType> {
    return this.callBySkill<NotificationMessageType>(
      land,
      landEventDrawProps,
      LandEventDrawMetadataKey,
    );
  }

  public async callLandEventsSummarize(
    land: SkillRouteType,
    landEventsSummarizeProps: LandEventsSummarizePropsType<unknown>,
  ): Promise<LandEventsSummarizeResultType> {
    return this.callBySkill<LandEventsSummarizeResultType>(
      land,
      landEventsSummarizeProps,
      LandEventsSummarizeMetadataKey,
    );
  }
}
