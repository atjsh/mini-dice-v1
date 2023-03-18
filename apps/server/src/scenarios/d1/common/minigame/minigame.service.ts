import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SkillRouteType } from '@packages/scenario-routing';
import type { UserIdType } from '@packages/shared-types';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { sign as signJWT, verify as verifyJWT } from 'jsonwebtoken';
import type { DynamicValueEventCase } from '../../../../common/random/event-case-processing';
import { calcRandomCashChangeEvent } from '../../../../common/random/event-case-processing';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';

export enum MinigameResultEnum {
  WIN = 'win',
  LOSE = 'lose',
}

export enum MinigameMoveEnum {
  HEAD = 'head',
  TAIL = 'tail',
  STOP = 'stop',
}

export function getRevercedMinigameMove(
  move: MinigameMoveEnum.HEAD | MinigameMoveEnum.TAIL,
): MinigameMoveEnum {
  if (move === MinigameMoveEnum.HEAD) {
    return MinigameMoveEnum.TAIL;
  }
  return MinigameMoveEnum.HEAD;
}

export function minigameMoveToKorean(move: MinigameMoveEnum): string {
  if (move === MinigameMoveEnum.HEAD) {
    return '앞면';
  }
  return '뒷면';
}

class MinigameHistory {
  constructor(public score: number, public id: string) {}

  increseScore() {
    this.score++;
  }
}

export class MinigameEasySubmitParamType {
  signedMinigameHistory: string;
  move: MinigameMoveEnum;
}

const minigameEasyEventValues: DynamicValueEventCase<MinigameResultEnum>[] = [
  {
    causeName: MinigameResultEnum.WIN,
    value: 1,
    weight: 0.5,
  },
  {
    causeName: MinigameResultEnum.LOSE,
    value: 0,
    weight: 0.5,
  },
];

export function calculateEarningFromMinigameScore(
  minigameScore: number,
  staringEarningCash: number,
) {
  return minigameScore > 0 ? 2 ** (minigameScore - 1) * staringEarningCash : 0;
}

@Injectable()
export class CommonMinigameService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private diceTossService: DiceTossService,
  ) {}

  signMinigameHistory(minigameHistory: MinigameHistory): string {
    return signJWT(
      instanceToPlain(minigameHistory),
      this.configService.get('JWT_SECRET')!,
    );
  }

  verifyMinigameHistory(signedMinigameHistory: string): MinigameHistory {
    return plainToInstance(
      MinigameHistory,
      verifyJWT(
        signedMinigameHistory,
        this.configService.get('JWT_SECRET')!,
      ) as MinigameHistory,
    );
  }

  createMinigameHistory(): MinigameHistory {
    return new MinigameHistory(0, randomUUID());
  }

  getGameResult() {
    return calcRandomCashChangeEvent<MinigameResultEnum>(
      minigameEasyEventValues,
    );
  }

  async commonIndex(userId: UserIdType, submitSkillRoute: SkillRouteType) {
    await this.userService.setUserAllowedSkillRoute(
      userId,
      submitSkillRoute,
      true,
    );
    return {
      minigameHistory: this.signMinigameHistory(this.createMinigameHistory()),
    };
  }

  async commonSubmit(
    signedMinigameHistory: string,
    userId: UserIdType,
    move: MinigameMoveEnum,
    startingEarningCash: number,
    maximumScore: number,
  ) {
    const minigameHistory = this.verifyMinigameHistory(signedMinigameHistory);

    if (move === MinigameMoveEnum.STOP) {
      const earningCash = calculateEarningFromMinigameScore(
        minigameHistory.score,
        startingEarningCash,
      );

      await this.userService.changeUserCash(userId, earningCash);

      await this.diceTossService.setUserCanTossDice(
        userId,
        getUserCanTossDice(SCENARIO_NAMES.D1, true),
      );

      return {
        userMove: move,
        canPlayMore: false,
        score: minigameHistory.score,
        earningCash: earningCash,
      };
    }

    const gameResult = this.getGameResult();

    if (gameResult.eventCase.causeName === MinigameResultEnum.WIN) {
      minigameHistory.increseScore();

      const earningCash = calculateEarningFromMinigameScore(
        minigameHistory.score,
        startingEarningCash,
      );

      if (maximumScore != -1 && minigameHistory.score >= maximumScore) {
        await this.userService.changeUserCash(userId, earningCash);
        await this.diceTossService.setUserCanTossDice(
          userId,
          getUserCanTossDice(SCENARIO_NAMES.D1, true),
        );

        return {
          userMove: move,
          canPlayMore: false,
          score: minigameHistory.score,
          gameResult: gameResult.eventCase.causeName,
          earningCash: earningCash,
        };
      } else {
        return {
          userMove: move,
          canPlayMore: true,
          score: minigameHistory.score,
          signedMinigameHistory: this.signMinigameHistory(minigameHistory),
          gameResult: gameResult.eventCase.causeName,
          earningCash: earningCash,
        };
      }
    } else {
      await this.diceTossService.setUserCanTossDice(
        userId,
        getUserCanTossDice(SCENARIO_NAMES.D1, true),
      );

      return {
        userMove: move,
        canPlayMore: false,
        score: minigameHistory.score,
        gameResult: gameResult.eventCase.causeName,
      };
    }
  }
}
