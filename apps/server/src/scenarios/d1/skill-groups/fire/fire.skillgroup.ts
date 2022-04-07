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
import { FireService, FireEventEnum } from './fire.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.fire)
export class FireSkillGroup implements SkillGroupController {
  constructor(private skillService: FireService) {}

  getSkillGroupAlias() {
    return '화재';
  }

  @Skill(D1ScenarioRoutes.skillGroups.fire.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.fire.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<FireService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '화재가 발생합니다.',
        }),
        (() => {
          switch (props.skillServiceResult.eventCase) {
            case FireEventEnum.LOSE_MONEY:
              return PlainMessage({
                title: '화재 피해 발생',
                description: `집에 화재가 발생하여 집이 홀랑 타 버렸습니다. ${cashLocale(
                  BigInt(
                    props.skillServiceResult.losing != ''
                      ? props.skillServiceResult.losing
                      : 0,
                  ),
                )} 잃었습니다.`,
              });
            case FireEventEnum.NO_PROFIT:
              return PlainMessage({
                title: '화재',
                description: `집에 화재가 발생했지만 빠른 진압으로 무사히 집과 목숨을 지켰습니다!!`,
              });
          }
        })(),
      ],
    });
  }
}
