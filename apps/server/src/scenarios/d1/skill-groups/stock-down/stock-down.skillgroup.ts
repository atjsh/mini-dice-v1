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
import { getStopImageUrl } from '../../../scenarios.commons';
import { D1ScenarioRoutes } from '../../routes';
import { StockDownService, StockUpAmountEnum } from './stock-down.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.stockDown)
export class StockDownSkillGroup implements SkillGroupController {
  constructor(private skillService: StockDownService) {}

  getSkillGroupAlias() {
    return '대폭락';
  }

  @Skill(D1ScenarioRoutes.skillGroups.stockDown.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stockDown.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<StockDownService, 'index'>
    >,
  ) {
    if (props.skillServiceResult) {
      return MessageResponseFactory({
        date: props.date,
        userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
        actionResultDrawings: [
          PlainMessage({
            thumbnail: {
              altName: '대폭락 칸 일러스트',
              imageUrl: getStopImageUrl(
                D1ScenarioRoutes.skillGroups.stockDown.skillGroupName,
              ),
            },
            title: `${this.getSkillGroupAlias()} 칸`,
            description: '주식의 가치가 하락합니다.',
          }),
          (() => {
            switch (props.skillServiceResult.eventCase) {
              case StockUpAmountEnum.ONE:
                return PlainMessage({
                  title: '주가가 하락했습니다',
                  description: `주식 1주당 주가가 ${cashLocale(
                    BigInt(props.skillServiceResult.originalStockPrice),
                  )}에서 ${cashLocale(
                    BigInt(props.skillServiceResult.falledStockPrice),
                  )}으로 떨어졌습니다.\n 현재 보유한 주식의 가치는 총 ${cashLocale(
                    BigInt(props.skillServiceResult.stockAmount) *
                      BigInt(props.skillServiceResult.falledStockPrice),
                  )} 입니다.`,
                });
              case StockUpAmountEnum.TWO:
                return PlainMessage({
                  title: '주가가 폭락했습니다',
                  description: `주식 1주당 주가가 ${cashLocale(
                    BigInt(props.skillServiceResult.originalStockPrice),
                  )}에서 ${cashLocale(
                    BigInt(props.skillServiceResult.falledStockPrice),
                  )}으로 많이 떨어졌습니다.\n 보유한 주식의 가치는 총 ${cashLocale(
                    BigInt(props.skillServiceResult.stockAmount) *
                      BigInt(props.skillServiceResult.falledStockPrice),
                  )} 입니다.`,
                });
            }
          })(),
          ...(props.skillServiceResult.forcedSoldCash == false
            ? []
            : [
                PlainMessage({
                  description: `주가가 ${cashLocale(
                    1000,
                  )} 이하로 하락했기 때문에 주식이 강제로 판매되었습니다... 현금으로 ${cashLocale(
                    BigInt(props.skillServiceResult.forcedSoldCash),
                  )} 받았습니다.`,
                }),
              ]),
        ],
      });
    }
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          thumbnail: {
            altName: '대폭락 칸 일러스트',
            imageUrl: getStopImageUrl(
              D1ScenarioRoutes.skillGroups.stockDown.skillGroupName,
            ),
          },
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '주식의 가치가 하락합니다.',
        }),
        PlainMessage({
          description:
            '앗! 보유중인 주식이 없습니다. 자산에 영향을 끼치지 않았습니다.',
        }),
      ],
    });
  }
}
