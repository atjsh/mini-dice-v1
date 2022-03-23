import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  SkillService,
  SkillServiceProps,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { Cache } from 'cache-manager';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import { D1ScenarioRoutes } from '../../routes';

const LAST_RPS_LOG_CACHE_KEY_PREFIX = 'rp:lastRpsLog';

export enum RpsMove {
  Scissors = 'scissors',
  Rock = 'rock',
  Paper = 'paper',
}

export function getRpsMoveAsKoreanText(rpsMove: RpsMove): string {
  switch (rpsMove) {
    case RpsMove.Rock:
      return '바위';
    case RpsMove.Paper:
      return '보';
    case RpsMove.Scissors:
      return '가위';
  }
}

export enum RpsResult {
  Win = 'win',
  Lose = 'lose',
  Draw = 'draw',
}

function getRandomRpsMove(): RpsMove {
  const moves = Object.values(RpsMove);
  return moves[Math.floor(Math.random() * moves.length)];
}

function compareRpsMoves(player: RpsMove, opp: RpsMove): RpsResult {
  if (player == opp) {
    return RpsResult.Draw;
  }

  switch (player) {
    case RpsMove.Rock:
      return opp == RpsMove.Scissors ? RpsResult.Win : RpsResult.Lose;
    case RpsMove.Paper:
      return opp == RpsMove.Rock ? RpsResult.Win : RpsResult.Lose;
    case RpsMove.Scissors:
      return opp == RpsMove.Paper ? RpsResult.Win : RpsResult.Lose;
  }
}

export type RpsLog = {
  rpsMove: RpsMove;
  playerName: string;
};

@Injectable()
export class RpsService implements SkillService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userRepository: UserRepository,
  ) {}

  private async getLastRpsLog(): Promise<RpsLog | undefined> {
    return await this.cacheManager.get<RpsLog>(LAST_RPS_LOG_CACHE_KEY_PREFIX);
  }

  private async setRpsLog(rpsLog: RpsLog) {
    await this.cacheManager.set(LAST_RPS_LOG_CACHE_KEY_PREFIX, rpsLog);
  }

  private async getLastRpsLogOrSetOne(): Promise<RpsLog> {
    const lastRpsLog = await this.getLastRpsLog();

    if (lastRpsLog) {
      return lastRpsLog;
    }

    const rpsLog: RpsLog = {
      rpsMove: getRandomRpsMove(),
      playerName: '컴퓨터',
    };

    await this.setRpsLog(rpsLog);

    return rpsLog;
  }

  public async index(props: SkillServiceProps) {
    await this.userRepository.setUserAllowedSkillRoute(
      props.userId,
      D1ScenarioRoutes.skillGroups.rps.skills.submit,
      true,
    );
    return null;
  }

  public async submit(
    props: SkillServiceProps<{ rpsMove: RpsMove; username: string }>,
  ) {
    const { rpsMove: playerRpsMove } = props;

    const oppRpsLog = await this.getLastRpsLogOrSetOne();

    const rpsResult = compareRpsMoves(playerRpsMove, oppRpsLog.rpsMove);

    await this.setRpsLog({
      rpsMove: playerRpsMove,
      playerName: props.username,
    });

    const cashChangingAmount =
      rpsResult == RpsResult.Lose
        ? -5000
        : rpsResult == RpsResult.Win
        ? 5000
        : 0;

    if (cashChangingAmount != 0) {
      await this.userRepository.changeUserCash(
        props.userId,
        cashChangingAmount,
      );
    }

    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    return {
      playerRpsMove,
      oppRpsLog,
      rpsResult,
      cashChangingAmount,
    };
  }
}
