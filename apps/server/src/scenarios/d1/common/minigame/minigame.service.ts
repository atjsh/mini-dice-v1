import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkillRouteType } from '@packages/scenario-routing';
import { UserIdType } from '@packages/shared-types';
import {
  calcRandomCashChangeEvent,
  DynamicValueEventCase,
} from 'apps/server/src/common/random/event-case-processing';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { sign as signJWT, verify as verifyJWT } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
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
    private userRepository: UserRepository,
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
    return new MinigameHistory(0, uuidv4());
  }

  getGameResult() {
    return calcRandomCashChangeEvent<MinigameResultEnum>(
      minigameEasyEventValues,
    );
  }

  async commonIndex(userId: UserIdType, submitSkillRoute: SkillRouteType) {
    await this.userRepository.setUserAllowedSkillRoute(
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

      await this.userRepository.changeUserCash(userId, earningCash);

      await this.userRepository.setUserCanTossDice(
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

      if (minigameHistory.score >= maximumScore) {
        await this.userRepository.changeUserCash(userId, earningCash);
        await this.userRepository.setUserCanTossDice(
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
      await this.userRepository.setUserCanTossDice(
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
