import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
} from '@packages/shared-types';
import type { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import type {
  IndexSkillPropsType,
  MethodReturnType,
} from '../../../../skill-group-lib/skill-service-lib';
import {
  drawDiceUserActivityMessage,
  Skill,
  SkillDraw,
  SkillGroup,
} from '../../../../skill-group-lib/skill-service-lib';
import type { DiceUserActivitySkillDrawPropsType } from '../../../../skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import { CarAccidentService } from './car-accident.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.carAccident)
export class CarAccidentSkillGroup implements SkillGroupController {
  constructor(private skillService: CarAccidentService) {}

  getSkillGroupAlias() {
    return '교통사고';
  }

  @Skill(D1ScenarioRoutes.skillGroups.carAccident.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.carAccident.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<CarAccidentService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        props.skillServiceResult.accident == 'safe'
          ? PlainMessage({
              title: '교통 사고',
              description: '교통 사고가 발생했지만 다치지 않았네요.',
            })
          : PlainMessage({
              title: '교통 사고',
              description:
                `교통 사고가 발생하여 '${props.skillServiceResult.accident}' 부상을 입었습니다. \n` +
                `${cashLocale(
                  props.skillServiceResult.cashDeclineAmount,
                )} 잃었습니다.`,
            }),
      ],
    });
  }
}
