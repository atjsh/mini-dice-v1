import { ForbiddenException, Injectable } from '@nestjs/common';
import type { SkillRouteType } from '@packages/scenario-routing';
import {
  getSkillRouteFromPath,
  getSkillRoutePath,
} from '@packages/scenario-routing';
import type { MessageResponseType } from '@packages/shared-types';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import type { UserInteractionOutputDto } from '../dice-toss/interface';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import { SkillLogService } from '../skill-log/skill-log.service';
import type { InteractionUserActivity } from '../skill-log/types/user-activity.dto';
import { renderRecentLandEventSummary } from '../user-activity/land-event-summary';
import { UserActivityService } from '../user-activity/user-activity.service';
import { UserLandCommentService } from '../user-land-comment/user-land-comment.service';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class UserInteractionWebService {
  constructor(
    private scenarioRoutingService: ScenarioRouteCallService,
    private userService: UserService,
    private skillLogService: SkillLogService,
    private userActivityService: UserActivityService,
    private userLandCommentService: UserLandCommentService,
  ) {}

  async callSkillFromWebUserInteraction(
    callingSkillRoute: SkillRouteType,
    callingSkillParam: Record<string, string>,
    userJwt: UserJwtDto,
    timezone: string,
  ): Promise<UserInteractionOutputDto> {
    const user = await this.userService.findUserWithCache(userJwt.userId);
    if (!user.signupCompleted) {
      throw new ForbiddenException('finish signup fist');
    }

    await this.userService.isUserCallingSkillAllowedOrThrow(
      userJwt.userId,
      callingSkillRoute,
    );

    const interactionUserActivity: InteractionUserActivity = {
      type: 'interaction',
      params: callingSkillParam,
    };

    const skillServiceResult = await this.scenarioRoutingService.callSkill<any>(
      callingSkillRoute,
      {
        userId: userJwt.userId,
        userActivity: interactionUserActivity,
      },
    );

    const lastSkillLog = await this.skillLogService.getLastLog(userJwt.userId);

    const skillServiceLog = await this.skillLogService.createLog({
      userId: userJwt.userId,
      skillRoute: getSkillRoutePath(callingSkillRoute),
      skillServiceResult: skillServiceResult,
      userActivity: interactionUserActivity,
    });

    const skillDrawResult =
      await this.scenarioRoutingService.callSkillDraw<MessageResponseType>(
        callingSkillRoute,
        {
          date: skillServiceLog.date,
          skillServiceResult: skillServiceResult,
          userActivity: interactionUserActivity,
          timezone: timezone,
        },
      );

    const updatedUser = await this.userService.findUserWithCache(
      userJwt.userId,
    );

    if (lastSkillLog) {
      const landEventSummaries =
        await this.userActivityService.getRecentLandEventSummaries(
          {
            userId: userJwt.userId,
            createdAtFrom: lastSkillLog.date,
            createdAtTo: new Date(),
          },
          timezone,
        );

      if (landEventSummaries.length > 0) {
        skillDrawResult.actionResultDrawings.push(
          renderRecentLandEventSummary(landEventSummaries),
        );
      }
    }
    return {
      user: serializeUserToJson(updatedUser),
      skillLog: {
        id: skillServiceLog.id,
        skillRoute: getSkillRouteFromPath(skillServiceLog.skillRoute),
        skillDrawResult: {
          ...skillDrawResult,
          actionResultDrawings: [
            ...skillDrawResult.actionResultDrawings,
            {
              type: 'landComments',
              landComments: await this.userLandCommentService.getLandComments(
                skillServiceLog.skillRoute,
              ),
            },
          ],
        },
      },
    };
  }
}
