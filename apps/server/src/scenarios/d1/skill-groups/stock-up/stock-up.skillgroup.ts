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
import { StockUpService, StockUpAmountEnum } from './stock-up.service';

@SkillGroup(D1ScenarioRoutes.skillGroups.stockUp)
export class StockUpSkillGroup implements SkillGroupController {
  constructor(private skillService: StockUpService) {}

  getSkillGroupAlias() {
    return '호황기';
  }

  @Skill(D1ScenarioRoutes.skillGroups.stockUp.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stockUp.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<StockUpService, 'index'>
    >,
  ) {
    if (props.skillServiceResult) {
      return MessageResponseFactory({
        date: props.date,
        userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
        actionResultDrawings: [
          PlainMessage({
            title: `${this.getSkillGroupAlias()} 칸`,
            description: '주식의 가치가 상승합니다.',
          }),
          (() => {
            switch (props.skillServiceResult.eventCase) {
              case StockUpAmountEnum.ONE:
                return PlainMessage({
                  title: '주가가 올랐습니다',
                  description: `주식 1주당 주가가 ${cashLocale(
                    BigInt(props.skillServiceResult.originalStockPrice),
                  )}에서 ${cashLocale(
                    BigInt(props.skillServiceResult.risedStockPrice),
                  )}으로 올랐습니다.\n 현재 보유한 주식의 가치는 총 ${cashLocale(
                    BigInt(props.skillServiceResult.stockAmount) *
                      BigInt(props.skillServiceResult.risedStockPrice),
                  )} 입니다.`,
                });
              case StockUpAmountEnum.TWO:
                return PlainMessage({
                  title: '주가가 많이 올랐습니다',
                  description: `주식 1주당 주가가 ${cashLocale(
                    BigInt(props.skillServiceResult.originalStockPrice),
                  )}에서 ${cashLocale(
                    BigInt(props.skillServiceResult.risedStockPrice),
                  )}으로 많이 올랐습니다.\n 현재 보유한 주식의 가치는 총 ${cashLocale(
                    BigInt(props.skillServiceResult.stockAmount) *
                      BigInt(props.skillServiceResult.risedStockPrice),
                  )} 입니다.`,
                });
            }
          })(),
        ],
      });
    }
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          title: `${this.getSkillGroupAlias()} 칸`,
          description: '주식의 가치가 상승합니다.',
        }),
        PlainMessage({
          description:
            '앗! 보유중인 주식이 없습니다. 다음 번에 주식을 보유한 상태에서 이 칸에 들러 주세요.',
        }),
      ],
    });
  }
}
