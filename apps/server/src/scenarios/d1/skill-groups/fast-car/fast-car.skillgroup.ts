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
import { FastCarEventEnum, FastCarService } from './fast-car.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.fastCar)
export class FastCarSkillGroup implements SkillGroupController {
  constructor(private skillService: FastCarService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '과속';
  }

  @Skill(D1ScenarioRoutes.skillGroups.fastCar.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.fastCar.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<FastCarService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '과속 칸에 도착.',
        }),
        props.skillServiceResult.eventCase.causeName ==
        FastCarEventEnum.LOSE_MONEY
          ? PlainMessage({
              description: `과속에 걸렸습니다. 벌금 ${cashLocale(
                props.skillServiceResult.value,
              )} 지불했습니다.`,
            })
          : PlainMessage({
              description: `과속에 걸렸습니다. 다만, 경고로 끝났네요.`,
            }),
      ],
    });
  }
}
