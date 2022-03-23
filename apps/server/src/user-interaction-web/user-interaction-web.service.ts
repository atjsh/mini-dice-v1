import { Injectable } from '@nestjs/common';
import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import { MessageResponseType } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { UserInteractionOutputDto } from '../dice-toss/interface';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import { SkillLogService } from '../skill-log/skill-log.service';
import { InteractionUserActivity } from '../skill-log/types/user-activity.dto';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class UserInteractionWebService {
  constructor(
    private scenarioRoutingService: ScenarioRouteCallService,
    private userRepository: UserRepository,
    private userService: UserService,
    private skillLogService: SkillLogService,
  ) {}

  async callSkillFromWebUserInteraction(
    callingSkillRoute: SkillRouteType,
    callingSkillParam: Record<string, string>,
    userJwt: UserJwtDto,
  ): Promise<UserInteractionOutputDto> {
    console.log(callingSkillRoute);

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
        },
      );

    // 유저의 정보를 확인함
    const user = await this.userRepository.findOneOrFail(userJwt.userId);

    return {
      user: serializeUserToJson(user),
      skillLog: {
        id: skillServiceLog.id,
        skillDrawResult: skillDrawResult,
      },
    };
  }
}
