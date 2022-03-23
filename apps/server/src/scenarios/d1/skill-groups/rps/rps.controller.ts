import { Body } from '@nestjs/common';
import { getSkillRoutePath, SkillGroup } from '@packages/scenario-routing';
import {
  MessageResponseFactory,
  PlainMessage,
  LinkGroup,
  Link,
  UserActivityMessage,
} from '@packages/shared-types';
import { UserJwtDto } from 'apps/server/src/auth/local-jwt/access-token/dto/user-jwt.dto';
import { UserJwt } from 'apps/server/src/profile/decorators/user.decorator';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from 'apps/server/src/skill-log/types/user-activity.dto';
import {
  SkillGroupAlias,
  WebIndexSkillDraw,
  MethodReturnType,
  WebSkill,
  WebSkillDraw,
} from 'apps/server/src/skill-service-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { D1ScenarioRoutes } from '../../routes';
import {
  getRpsMoveAsKoreanText,
  RpsMove,
  RpsResult,
  RpsService,
} from './rps.service';

class RpsSubmitParamType {
  move: RpsMove;
}

@SkillGroup(D1ScenarioRoutes.skillGroups.rps)
export class RpsController extends SkillGroupController<RpsService> {
  constructor(
    private rpsService: RpsService,
    private userRepository: UserRepository,
  ) {
    super(rpsService);
  }

  @SkillGroupAlias()
  getSkillGroupAlias() {
    return '가위바위보';
  }

  @WebIndexSkillDraw()
  async webIndexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<RpsService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: this.drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description:
            '모르는 사람과 가위바위보 게임을 합니다. 이기면 5000원을 받게 되지만, 지면 5000원을 내야 합니다.',
        }),
        LinkGroup({
          type: 'linkGroup',
          description: '어떤 걸 내시겠습니까?',
          links: Object.values(RpsMove).map((rpsMove: RpsMove) =>
            Link({
              skillRouteURL: getSkillRoutePath(
                D1ScenarioRoutes.skillGroups.rps.skills.submit,
              ),
              displayText: getRpsMoveAsKoreanText(rpsMove),
              param: {
                move: rpsMove,
              },
            }),
          ),
        }),
      ],
    });
  }

  @WebSkill(D1ScenarioRoutes.skillGroups.rps.skills.submit)
  async submit(
    @Body() props: InteractionUserActivity<RpsSubmitParamType>,
    @UserJwt() { userId }: UserJwtDto,
  ) {
    const user = await this.userRepository.findOneOrFail(userId);
    return this.rpsService.submit({
      userId: userId,
      rpsMove: props.params.move,
      username: user.username,
    });
  }

  @WebSkillDraw(D1ScenarioRoutes.skillGroups.rps.skills.submit)
  async submitDraw(
    @Body()
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<RpsService, 'submit'>
    >,
  ) {
    const rspGameResultDescription = `당신이 가위바위보 대결을 한 유저 '${
      props.skillServiceResult.oppRpsLog.playerName
    }'는 '${getRpsMoveAsKoreanText(
      props.skillServiceResult.oppRpsLog.rpsMove,
    )}'를 냈네요.`;
    const rpsGameCashChangeDescription =
      props.skillServiceResult.cashChangingAmount != 0
        ? props.skillServiceResult.cashChangingAmount > 0
          ? `${props.skillServiceResult.cashChangingAmount}원 벌었습니다.`
          : `${props.skillServiceResult.cashChangingAmount}원 잃었습니다...`
        : '';

    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: UserActivityMessage({
        type: 'interactionUserActivityMessage',
        title: '가위바위보 게임',
        description: `나는 '${getRpsMoveAsKoreanText(
          props.skillServiceResult.playerRpsMove,
        )}'를 냈다`,
      }),
      actionResultDrawings: [
        props.skillServiceResult.rpsResult == RpsResult.Win
          ? PlainMessage({
              title: '가위바위보 승리!',
              description: `${rspGameResultDescription}\n${rpsGameCashChangeDescription}`,
            })
          : props.skillServiceResult.rpsResult == RpsResult.Lose
          ? PlainMessage({
              title: '가위바위보 패배!',
              description: `${rspGameResultDescription}\n${rpsGameCashChangeDescription}`,
            })
          : PlainMessage({
              title: '가위바위보 무승부에요',
              description: rspGameResultDescription,
            }),
      ],
    });
  }
}
