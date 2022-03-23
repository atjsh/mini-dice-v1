import { Body } from '@nestjs/common';
import { MessageResponseFactory, PlainMessage } from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  SkillGroup,
  MethodReturnType,
  SkillDraw,
  drawDiceUserActivityMessage,
  IndexSkillPropsType,
  Skill,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { DogdripScenarioRoutes } from '../../routes';
import { CarAccidentService } from './car-accident.service';

@SkillGroup(DogdripScenarioRoutes.skillGroups.carAccident)
export class CarAccidentController implements SkillGroupController {
  constructor(private skillService: CarAccidentService) {}

  getSkillGroupAlias() {
    return '교통사고';
  }

  @Skill(DogdripScenarioRoutes.skillGroups.carAccident.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(DogdripScenarioRoutes.skillGroups.carAccident.skills.index)
  async indexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<CarAccidentService, 'index'>
    >,
  ) {
    return props.skillServiceResult.accident == 'safe'
      ? MessageResponseFactory({
          date: props.date,
          userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
          actionResultDrawings: [
            PlainMessage({
              title: '교통 사고',
              description: '교통 사고가 발생했지만 다치지 않았네요.',
            }),
          ],
        })
      : MessageResponseFactory({
          date: props.date,
          userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
          actionResultDrawings: [
            PlainMessage({
              title: '교통 사고',
              description:
                `교통 사고가 발생하여 '${props.skillServiceResult.accident}' 부상을 입었습니다. \n` +
                `${props.skillServiceResult.cacheDeclineAmount}원 잃었습니다.`,
            }),
          ],
        });
  }
}
