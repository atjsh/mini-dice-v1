import { Body } from '@nestjs/common';
import { SkillGroup } from '@packages/scenario-routing';
import { MessageResponseFactory, PlainMessage } from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import {
  SkillGroupAlias,
  WebIndexSkillDraw,
  MethodReturnType,
} from 'apps/server/src/skill-service-lib/skill-service-lib';
import { DogdripScenarioRoutes } from '../../routes';
import { NightFoodService, PROFIT_STATUS } from './night-food.service';

const nightFoodPlainMessageTitle = '야식';

@SkillGroup(DogdripScenarioRoutes.skillGroups.nightFood)
export class NightFoodController extends SkillGroupController<NightFoodService> {
  constructor(nightFoodService: NightFoodService) {
    super(nightFoodService);
  }

  @SkillGroupAlias()
  getSkillGroupAlias() {
    return '야식';
  }

  @WebIndexSkillDraw()
  async webIndexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<NightFoodService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: this.drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '야식을 사업을 합니다.',
        }),
        (() => {
          switch (props.skillServiceResult.profitStatus) {
            case PROFIT_STATUS.MADE_PROFIT:
              return PlainMessage({
                title: nightFoodPlainMessageTitle,
                description: `'${props.skillServiceResult.foodDetail.foodName}' 야식을 판매하여 ${props.skillServiceResult.foodDetail.changingAmount}원 벌었습니다.`,
              });
            case PROFIT_STATUS.LOST_PROFIT:
              return PlainMessage({
                title: nightFoodPlainMessageTitle,
                description: `'${props.skillServiceResult.foodDetail.foodName}' 야식을 팔아 보았지만 손해를 봤습니다. ${props.skillServiceResult.foodDetail.changingAmount}원 잃었습니다.`,
              });
            case PROFIT_STATUS.NO_PROFIT:
              return PlainMessage({
                title: nightFoodPlainMessageTitle,
                description: `'${props.skillServiceResult.foodDetail.foodName}' 야식을 판매했지만 본전치기 했습니다.`,
              });
          }
        })(),
      ],
    });
  }
}
