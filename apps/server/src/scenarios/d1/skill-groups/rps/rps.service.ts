import { Injectable } from '@nestjs/common';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type {
  SkillService,
  SkillServiceProps,
} from '../../../../skill-group-lib/skill-service-lib';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import { CommonRpsgameService } from '../../common/rpsgame/common-rpsgame.service';
import { D1ScenarioRoutes } from '../../routes';

export enum RpsMove {
  Scissors = 'scissors',
  Rock = 'rock',
  Paper = 'paper',
}

function isRpsMove(value: string): value is RpsMove {
  return Object.values(RpsMove).includes(value as RpsMove);
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
    private userService: UserService,
    private diceTossService: DiceTossService,
    private commonRpsgameService: CommonRpsgameService,
  ) {}

  private async getLastRpsLog(): Promise<RpsLog | undefined> {
    const latestRpsgame = await this.commonRpsgameService.getLatestRpsgame('1');

    if (!latestRpsgame) {
      return;
    }

    if (!isRpsMove(latestRpsgame.move)) {
      return;
    }

    return {
      rpsMove: latestRpsgame.move,
      playerName: latestRpsgame.username,
    };
  }

  private async setRpsLog(rpsLog: RpsLog) {
    await this.commonRpsgameService.setRpsgame(
      '1',
      rpsLog.playerName,
      rpsLog.rpsMove,
    );
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
    await this.userService.setUserAllowedSkillRoute(
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
      await this.userService.changeUserCash(props.userId, cashChangingAmount);
    }

    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1, true),
    );

    return {
      playerRpsMove,
      oppRpsLog,
      rpsResult,
      cashChangingAmount,
    };
  }
}
