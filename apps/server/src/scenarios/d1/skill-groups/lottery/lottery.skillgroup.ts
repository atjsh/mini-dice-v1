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
import { LotteryEventEnum, LotteryService } from './lottery.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.lottery)
export class LotterySkillGroup implements SkillGroupController {
  constructor(private skillService: LotteryService) {}

  getSkillGroupAlias(): string | Promise<string> {
    return '동전 던지기 초급';
  }

  @Skill(D1ScenarioRoutes.skillGroups.lottery.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.lottery.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<LotteryService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description:
            '동전 던지기 칸에 도착했습니다. 동전 던지기 초급을 진행합니다. 앞면이 나오면 내가 이깁니다.',
        }),
        props.skillServiceResult.eventCase.causeName ==
        LotteryEventEnum.MADE_PROFIT
          ? PlainMessage({
              title: '앞면이 나왔습니다! 이겼습니다.',
              description: `${cashLocale(
                props.skillServiceResult.value,
              )} 벌었습니다.`,
            })
          : PlainMessage({
              title: '뒷면이 나왔습니다! 졌습니다...',
              description: `졌지만, 동전 던지기에서는 당신이 지더라도 돈을 내지 않습니다. 참 다행이죠?`,
            }),
      ],
    });
  }
}
