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
import { getStopImageUrl } from '../../../scenarios.commons';
import { D1ScenarioRoutes } from '../../routes';
import { PickedItemService } from './picked-item.service';
import { PickedItemEventEnum } from './picked-item.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.pickedItem)
export class PickedItemSkillGroup implements SkillGroupController {
  constructor(private skillService: PickedItemService) {}

  getSkillGroupAlias() {
    return '분실물발견';
  }

  @Skill(D1ScenarioRoutes.skillGroups.pickedItem.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.pickedItem.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<PickedItemService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          thumbnail: {
            altName: '토지 칸 일러스트',
            imageUrl: getStopImageUrl(
              D1ScenarioRoutes.skillGroups.pickedItem.skillGroupName,
            ),
          },
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '분실물을 발견했습니다.',
        }),
        (() => {
          switch (
            props.skillServiceResult.cashChangeEvent.eventCase.causeName
          ) {
            case PickedItemEventEnum.MADE_PROFIT:
              return PlainMessage({
                description: `'${
                  props.skillServiceResult.item
                }' 분실물을 중고로 팔았습니다! ${cashLocale(
                  props.skillServiceResult.cashChangeEvent.value,
                )} 벌었습니다.`,
              });
            case PickedItemEventEnum.NO_PROFIT:
              return PlainMessage({
                description: `'${props.skillServiceResult.item}' 분실물을 발견했습니다. 집에서 쓰기 위해 가져갔습니다.`,
              });
          }
        })(),
      ],
    });
  }
}
