import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
} from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  drawDiceUserActivityMessage,
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import { GameDevService, GameDevEventEnum } from './game-dev.service';

const nightFoodPlainMessageTitle = '게임 개발';

@SkillGroup(D1ScenarioRoutes.skillGroups.gameDev)
export class GameDevSkillGroup implements SkillGroupController {
  constructor(private skillService: GameDevService) {}

  getSkillGroupAlias() {
    return '게임개발';
  }

  @Skill(D1ScenarioRoutes.skillGroups.gameDev.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.gameDev.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<GameDevService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '게임을 개발하여 사람들에게 판매합니다.',
        }),
        (() => {
          switch (
            props.skillServiceResult.cashChangeEvent.eventCase.causeName
          ) {
            case GameDevEventEnum.MADE_PROFIT:
              return PlainMessage({
                title: '수익을 남겼습니다',
                description: `'${
                  props.skillServiceResult.game
                }' 게임을 개발하여 ${cashLocale(
                  props.skillServiceResult.cashChangeEvent.value,
                )} 벌었습니다.`,
              });
            case GameDevEventEnum.LOST_PROFIT:
              return PlainMessage({
                title: '손해를 입었습니다',
                description: `'${
                  props.skillServiceResult.game
                }' 게임을 개발하여 팔아 보았지만 결국 손해를 봤습니다. ${cashLocale(
                  props.skillServiceResult.cashChangeEvent.value,
                )} 잃었습니다.`,
              });
            case GameDevEventEnum.NO_PROFIT:
              return PlainMessage({
                title: '본전 쳤네요',
                description: `'${props.skillServiceResult.game}' 게임을 판매해봤지만 본전치기 했습니다.`,
              });
          }
        })(),
      ],
    });
  }
}
