import { Body } from '@nestjs/common';
import { SkillGroup } from '@packages/scenario-routing';
import { MessageResponseFactory, PlainMessage } from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import {
  MethodReturnType,
  SkillGroupAlias,
  WebIndexSkillDraw,
} from 'apps/server/src/skill-service-lib/skill-service-lib';
import { D1ScenarioRoutes } from '../../routes';
import { CarAccidentService } from './car-accident.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.carAccident)
export class CarAccidentController extends SkillGroupController<CarAccidentService> {
  constructor(carAccidentService: CarAccidentService) {
    super(carAccidentService);
  }

  @SkillGroupAlias()
  getSkillGroupAlias() {
    return '교통사고';
  }

  @WebIndexSkillDraw()
  async webIndexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<CarAccidentService, 'index'>
    >,
  ) {
    return props.skillServiceResult.accident == 'safe'
      ? MessageResponseFactory({
          date: props.date,
          userRequestDrawings: this.drawDiceUserActivityMessage(
            props.userActivity,
          ),
          actionResultDrawings: [
            PlainMessage({
              title: '교통 사고',
              description: '교통 사고가 발생했지만 다치지 않았네요.',
            }),
          ],
        })
      : MessageResponseFactory({
          date: props.date,
          userRequestDrawings: this.drawDiceUserActivityMessage(
            props.userActivity,
          ),
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
