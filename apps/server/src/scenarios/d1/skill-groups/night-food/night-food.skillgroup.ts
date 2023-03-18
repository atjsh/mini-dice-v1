import {
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
} from '@packages/shared-types';
import { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import {
  drawDiceUserActivityMessage,
  IndexSkillPropsType,
  MethodReturnType,
  Skill,
  SkillDraw,
  SkillGroup,
} from '../../../../skill-group-lib/skill-service-lib';
import { DiceUserActivitySkillDrawPropsType } from '../../../../skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import { NightFoodService, PROFIT_STATUS } from './night-food.service';

const nightFoodPlainMessageTitle = '야식';

@SkillGroup(D1ScenarioRoutes.skillGroups.nightFood)
export class NightFoodSkillGroup implements SkillGroupController {
  constructor(private skillService: NightFoodService) {}

  getSkillGroupAlias() {
    return '야식';
  }

  @Skill(D1ScenarioRoutes.skillGroups.nightFood.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.nightFood.skills.index)
  async indexDraw(
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
          description: '야식 사업을 합니다.',
        }),
        (() => {
          switch (props.skillServiceResult.profitStatus) {
            case PROFIT_STATUS.MADE_PROFIT:
              return PlainMessage({
                title: nightFoodPlainMessageTitle,
                description: `'${
                  props.skillServiceResult.foodDetail.foodName
                }' 야식을 판매하여 ${cashLocale(
                  props.skillServiceResult.foodDetail.changingAmount,
                )} 벌었습니다.`,
              });
            case PROFIT_STATUS.LOST_PROFIT:
              return PlainMessage({
                title: nightFoodPlainMessageTitle,
                description: `'${
                  props.skillServiceResult.foodDetail.foodName
                }' 야식을 팔아 보았지만 손해를 봤습니다. ${cashLocale(
                  props.skillServiceResult.foodDetail.changingAmount,
                )} 잃었습니다.`,
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
