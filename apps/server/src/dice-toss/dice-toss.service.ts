import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  getSkillRouteFromPath,
  getSkillRoutePath,
  SkillRouteType,
} from '@packages/scenario-routing';
import {
  getStockInitialData,
  MessageResponseType,
  UserIdType,
} from '@packages/shared-types';
import * as _ from 'lodash';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { getRandomInteger } from '../common/random/random-number';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import {
  CommonStockService,
  StockPriceChangeResult,
} from '../scenarios/d1/common/stock/stock.service';
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

function isOdd(num: number | bigint) {
  return BigInt(num) % BigInt(2);
}

@Injectable()
export class DiceTossService {
  constructor(
    private userRepository: UserRepository,
    private skillLogService: SkillLogService,
    private commonStockService: CommonStockService,
    private scenarioRouteCallService: ScenarioRouteCallService,
  ) {}

  private throwDices(dices: number): number[] {
    return Array(dices)
      .fill(0)
      .map(() => getRandomInteger(1, 6));
    // return [11];
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

  private async createChangeOnStock(
    diceResult: number[],
    userId: UserIdType,
  ): Promise<StockPriceChangeResult | undefined> {
    const uniqueDiceResult = _.uniq(diceResult);
    const isDiceResultEqual = uniqueDiceResult.length == 1;

    if (isDiceResultEqual) {
      const user = await this.userRepository.findUserWithCache(userId);
      if (user.stockId) {
        const { stockRisingPrice, stockFallingPrice } = getStockInitialData(
          user.stockId,
        );

        let stockChanging: bigint;

        if (isOdd(diceResult[0])) {
          stockChanging = -stockFallingPrice;
        } else {
          stockChanging = stockRisingPrice;
        }

        return await this.commonStockService.changeStockPrice(
          userId,
          stockChanging,
        );
      }
    }

    return undefined;
  }

  async tossDiceAndGetWebMessageResponse(
    userJwt: UserJwtDto,
    timezone: string,
  ): Promise<DiceTossOutputDto> {
    const user = await this.userRepository.findUserWithCache(userJwt.userId);
    isUserThrowingDiceTossAllowedOrThrow(user);
    if (!user.signupCompleted) {
      throw new ForbiddenException('finish signup fist');
    }

    const diceResult = this.throwDices(2);

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

    if (lastSkillLog.isCreated) {
      const skillDrawResult =
        await this.scenarioRouteCallService.callSkillDraw<MessageResponseType>(
          getSkillRouteFromPath(lastSkillLog.log.skillRoute),
          {
            date: lastSkillLog.log.date,
            skillServiceResult: null,
            userActivity: {
              type: 'gameStart',
            },
            timezone: timezone,
          },
        );

      return {
        user: serializeUserToJson(
          await this.userRepository.findUserWithCache(userJwt.userId),
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
      stockPriceChange: await this.createChangeOnStock(
        diceResult,
        userJwt.userId,
      ),
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
          timezone: timezone,
        },
      );

    return {
      user: serializeUserToJson(
        await this.userRepository.findUserWithCache(userJwt.userId),
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
