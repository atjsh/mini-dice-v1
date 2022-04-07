import { getSkillRoutePath } from '@packages/scenario-routing';
import {
  cashLocale,
  Link,
  LinkGroup,
  MessageResponseFactory,
  PlainMessage,
  UserActivityMessage,
} from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  drawDiceUserActivityMessage,
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
  SkillPropsType,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { InteractionUserActivity } from 'apps/server/src/skill-log/types/user-activity.dto';
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
export class RpsSkillGroup implements SkillGroupController {
  constructor(
    private skillService: RpsService,
    private userRepository: UserRepository,
  ) {}

  getSkillGroupAlias() {
    return '가위바위보';
  }

  @Skill(D1ScenarioRoutes.skillGroups.rps.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.rps.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<RpsService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: `모르는 사람과 가위바위보 게임을 합니다. 이기면 ${cashLocale(
            5000,
          )}을 받게 되지만, 지면 ${cashLocale(5000)}을 내야 합니다.`,
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

  @Skill(D1ScenarioRoutes.skillGroups.rps.skills.submit)
  async submit({
    userActivity,
    userId,
  }: SkillPropsType<InteractionUserActivity<RpsSubmitParamType>>) {
    const user = await this.userRepository.findUserWithCache(userId);
    return this.skillService.submit({
      userId: userId,
      rpsMove: userActivity.params.move,
      username: user.username,
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.rps.skills.submit)
  async submitDraw(
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
          ? `${cashLocale(
              props.skillServiceResult.cashChangingAmount,
            )} 벌었습니다.`
          : `${cashLocale(
              props.skillServiceResult.cashChangingAmount,
            )} 잃었습니다...`
        : '';

    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: [
        UserActivityMessage({
          type: 'interactionUserActivityMessage',
          title: '가위바위보 게임',
          description: `나는 '${getRpsMoveAsKoreanText(
            props.skillServiceResult.playerRpsMove,
          )}'를 냈다`,
        }),
      ],
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
