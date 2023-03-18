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
import {
  DragonMoneyEventEnum,
  DragonMoneyService,
} from './dragon-money.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.dragonMoney)
export class DragonMoneySkillGroup implements SkillGroupController {
  constructor(private skillService: DragonMoneyService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '용돈';
  }

  @Skill(D1ScenarioRoutes.skillGroups.dragonMoney.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.dragonMoney.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<DragonMoneyService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '용돈 칸에 도착! 부모님으로부터 용돈을 받아봅시다.',
        }),
        props.skillServiceResult.eventCase.causeName ==
        DragonMoneyEventEnum.MADE_PROFIT
          ? PlainMessage({
              title: '용돈을 받았습니다!',
              description: `부모님 집의 집안일을 처리하여 용돈으로 ${cashLocale(
                props.skillServiceResult.value,
              )} 받았습니다.`,
            })
          : PlainMessage({
              title: '하지만 용돈을 받지 못했습니다',
              description: `오늘은 용돈을 주지 않으시네요.`,
            }),
      ],
    });
  }
}
