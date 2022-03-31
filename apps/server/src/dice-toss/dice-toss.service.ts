import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getSkillRouteFromPath,
  getSkillRoutePath,
  SkillRouteType,
} from '@packages/scenario-routing';
import { MessageResponseType, UserIdType } from '@packages/shared-types';
import * as _ from 'lodash';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { getRandomInteger } from '../common/random/random-number';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import {
  D1ScenarioRoutes,
  OrderedD1ScenarioRoutes,
} from '../scenarios/d1/routes';
import { SkillLogService } from '../skill-log/skill-log.service';
import { DiceUserActivity } from '../skill-log/types/user-activity.dto';
import {
  isUserThrowingDiceTossAllowedOrThrow,
  serializeUserToJson,
} from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { DiceTossOutputDto } from './interface';

@Injectable()
export class DiceTossService {
  constructor(
    private userRepository: UserRepository,
    private skillLogService: SkillLogService,
    private scenarioRouteCallService: ScenarioRouteCallService,
  ) {}

  private throwDices(dices: number): number[] {
    // return Array(dices)
    //   .fill(0)
    //   .map(() => getRandomInteger(1, 2));
    return [2];
  }

  private moveUserForward(
    currentSkillRoute: SkillRouteType,
    movingCount: number,
    orderedSkillRoutes: SkillRouteType[],
  ): SkillRouteType {
    const currentSkillRouteIndex = _.findIndex(
      orderedSkillRoutes,
      (skillRoute) =>
        skillRoute.skillGroupName == currentSkillRoute.skillGroupName &&
        skillRoute.scenarioName == currentSkillRoute.scenarioName,
    );

    const nextSkillRouteIndex =
      (currentSkillRouteIndex + movingCount) % orderedSkillRoutes.length;

    return orderedSkillRoutes[nextSkillRouteIndex];
  }

  private createChangeOnStock(
    diceResult: number[],
    userId: UserIdType,
  ): number | undefined {
    const uniqueDiceResult = _.uniq(diceResult);
    const isDiceResultEqual = uniqueDiceResult.length == 1;

    if (isDiceResultEqual == false) {
      return undefined;
    }

    return;
  }

  async tossDiceAndGetWebMessageResponse(
    userJwt: UserJwtDto,
  ): Promise<DiceTossOutputDto> {
    const user = await this.userRepository.findOneOrFail(userJwt.userId);
    isUserThrowingDiceTossAllowedOrThrow(user);
    if (user.signupCompleted == false) {
      throw new ForbiddenException('finish signup fist');
    }

    const diceResult = this.throwDices(1);

    const lastSkillLog = await this.skillLogService.getLastLogOrCreateOne({
      userId: userJwt.userId,
      skillRoute: getSkillRoutePath(
        D1ScenarioRoutes.skillGroups.mapStarter.skills.index,
      ),
      skillServiceResult: undefined,
      userActivity: {
        type: 'gameStart',
      },
    });

    if (lastSkillLog.isCreated == true) {
      const skillDrawResult =
        await this.scenarioRouteCallService.callSkillDraw<MessageResponseType>(
          getSkillRouteFromPath(lastSkillLog.log.skillRoute),
          {
            date: lastSkillLog.log.date,
            skillServiceResult: null,
            userActivity: {
              type: 'gameStart',
            },
          },
        );

      return {
        user: serializeUserToJson(
          await this.userRepository.findOneOrFail(userJwt.userId),
        ),
        skillLog: {
          skillDrawResult: skillDrawResult,
          skillRoute: getSkillRouteFromPath(lastSkillLog.log.skillRoute),
          id: lastSkillLog.log.id,
        },
        diceResult: diceResult,
      };
    }

    const nextSkillRoute = this.moveUserForward(
      getSkillRouteFromPath(lastSkillLog.log.skillRoute),
      _.sum(diceResult),
      OrderedD1ScenarioRoutes,
    );

    const diceUserActivity: DiceUserActivity = {
      type: 'dice',
      diceResult,
      stockChangeAmount: this.createChangeOnStock(diceResult, userJwt.userId),
    };

    const skillServiceResult =
      await this.scenarioRouteCallService.callSkill<any>(nextSkillRoute, {
        userActivity: diceUserActivity,
        userId: userJwt.userId,
      });

    const skillServiceLog = await this.skillLogService.createLog({
      userId: userJwt.userId,
      skillRoute: getSkillRoutePath(nextSkillRoute),
      skillServiceResult: skillServiceResult,
      userActivity: diceUserActivity,
    });

    const skillDrawResult =
      await this.scenarioRouteCallService.callSkillDraw<MessageResponseType>(
        nextSkillRoute,
        {
          date: skillServiceLog.date,
          skillServiceResult: skillServiceResult,
          userActivity: diceUserActivity,
        },
      );

    return {
      user: serializeUserToJson(
        await this.userRepository.findOneOrFail(userJwt.userId),
      ),
      skillLog: {
        skillDrawResult: skillDrawResult,
        skillRoute: nextSkillRoute,
        id: skillServiceLog.id,
      },
      diceResult: diceResult,
    };
  }
}
