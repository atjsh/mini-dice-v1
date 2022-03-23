import { Body } from '@nestjs/common';
import { MessageResponseFactory, PlainMessage } from '@packages/shared-types';
import { SkillGroupController } from 'apps/server/src/skill-group-lib/skill-group-controller-factory';
import {
  SkillGroup,
  MethodReturnType,
  SkillDraw,
  IndexSkillPropsType,
  Skill,
  drawDiceUserActivityMessage,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import { DiceUserActivitySkillDrawPropsType } from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { DogdripScenarioRoutes } from '../../routes';
import { NightFoodService, PROFIT_STATUS } from './night-food.service';

const nightFoodPlainMessageTitle = '야식';

@SkillGroup(DogdripScenarioRoutes.skillGroups.nightFood)
export class NightFoodController implements SkillGroupController {
  constructor(private skillService: NightFoodService) {}

  getSkillGroupAlias() {
    return '야식';
  }

  @Skill(DogdripScenarioRoutes.skillGroups.nightFood.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(DogdripScenarioRoutes.skillGroups.nightFood.skills.index)
  async indexDraw(
    @Body()
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<NightFoodService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
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
