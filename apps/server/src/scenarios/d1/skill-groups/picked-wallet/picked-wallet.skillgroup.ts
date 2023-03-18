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
import type { PickedWalletService } from './picked-wallet.service';
import { PickedWalletEventEnum } from './picked-wallet.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.pickedWallet)
export class PickedWalletSkillGroup implements SkillGroupController {
  constructor(private skillService: PickedWalletService) {}

  getSkillGroupAlias() {
    return '지갑발견';
  }

  @Skill(D1ScenarioRoutes.skillGroups.pickedWallet.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.pickedWallet.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<PickedWalletService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          thumbnail: {
            altName: '지갑을 줍다 일러스트',
            imageUrl: getStopImageUrl(
              D1ScenarioRoutes.skillGroups.pickedWallet.skillGroupName,
            ),
          },
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '지갑을 발견했습니다.',
        }),
        (() => {
          switch (
            props.skillServiceResult.cashChangeEvent.eventCase.causeName
          ) {
            case PickedWalletEventEnum.MADE_PROFIT:
              return PlainMessage({
                description: `지갑을 찾아 주인에게 돌려주었습니다. 보상금으로 ${cashLocale(
                  props.skillServiceResult.cashChangeEvent.value,
                )} 벌었습니다.`,
              });
            case PickedWalletEventEnum.NO_PROFIT:
              return PlainMessage({
                description: `지갑을 찾았지만 알고보니 내용물이 텅 빈 헌 지갑이었네요. 돈을 벌지는 못했습니다.`,
              });
          }
        })(),
      ],
    });
  }
}
