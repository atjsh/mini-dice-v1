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
import { PartTimeWorkService } from './part-time-work.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.partTimeWork)
export class PartTimeWorkSkillGroup implements SkillGroupController {
  constructor(private skillService: PartTimeWorkService) {}

  getSkillGroupAlias() {
    return '아르바이트';
  }

  @Skill(D1ScenarioRoutes.skillGroups.partTimeWork.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.partTimeWork.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<PartTimeWorkService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          description: '아르바이트 칸에 도착했습니다.',
        }),
        PlainMessage({
          title: '아르바이트를 한 탕 달렸습니다.',
          description: `아르바이트를 하고 보상으로 ${cashLocale(
            props.skillServiceResult.value,
          )} 받았습니다.`,
        }),
      ],
    });
  }
}
