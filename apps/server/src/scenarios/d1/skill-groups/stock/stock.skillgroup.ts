import { getSkillRoutePath } from '@packages/scenario-routing';
import type { StockStatusJson, StockIdType } from '@packages/shared-types';
import {
  FormMessage,
  InputField,
  DataField,
  cashLocale,
  MessageResponseFactory,
  PlainMessage,
  LinkGroup,
  Link,
  UserActivityMessage,
} from '@packages/shared-types';
import type { SkillGroupController } from '../../../../skill-group-lib/skill-group-controller-factory';
import type {
  IndexSkillPropsType,
  MethodReturnType,
  SkillPropsType,
} from '../../../../skill-group-lib/skill-service-lib';
import {
  SkillGroup,
  Skill,
  SkillDraw,
  drawDiceUserActivityMessage,
} from '../../../../skill-group-lib/skill-service-lib';
import type {
  DiceUserActivitySkillDrawPropsType,
  InteractionUserActivitySkillDrawPropsType,
} from '../../../../skill-log/types/skill-draw-props.dto';
import type { InteractionUserActivity } from '../../../../skill-log/types/user-activity.dto';
import { getStopImageUrl } from '../../../scenarios.commons';
import { StockOwningStatusEnum } from '../../common/stock/stock.service';
import { D1ScenarioRoutes } from '../../routes';
import { StockService } from './stock.service';

class StockBuySubmitDto {
  amount: string;
  stockId: string;
}

class StockBuyMoreSubmitDto {
  amount: string;
}

@SkillGroup(D1ScenarioRoutes.skillGroups.stock)
export class StockSkillGroup implements SkillGroupController {
  constructor(private skillService: StockService) {}
  getSkillGroupAlias(): string | Promise<string> {
    return '주식';
  }

  @Skill(D1ScenarioRoutes.skillGroups.stock.skills.index)
  async index(indexSkillProps: IndexSkillPropsType) {
    return await this.skillService.index(indexSkillProps);
  }

  stockBuyMoreFormMessage(
    stockStatus: StockStatusJson,
    maxBuyableAmount: bigint,
  ) {
    return FormMessage({
      title: `${stockStatus.stockName} 주식 더 구매하기`,
      description: stockStatus.stockTicker,
      inputFields: [
        InputField({
          label: '구매량',
          name: 'amount',
          placeholder:
            BigInt(maxBuyableAmount) > 0
              ? `1 이상, ${maxBuyableAmount} 이하`
              : '구매 불가 (현금 부족)',
          maxNumber: `maxBuyableAmount`,
          minNumber: `${1}`,
          type: 'number',
        }),
        InputField({
          label: 'stockId',
          name: 'stockId',
          type: 'string',
          isHidden: true,
          defaultValue: stockStatus.id,
        }),
      ],
      dataFields: [
        DataField({
          isCash: false,
          label: '이름',
          value: stockStatus.stockName,
          inline: true,
        }),
        DataField({
          isCash: true,
          label: '1주당 가격',
          value: String(stockStatus.stockCurrentPrice),
          inline: true,
        }),
        DataField({
          isCash: false,
          label: '더블 시 주가 증감',
          value: `↑${cashLocale(
            BigInt(stockStatus.stockRisingPrice),
          )} ↓${cashLocale(BigInt(stockStatus.stockFallingPrice))}`,
          inline: true,
        }),
        DataField({
          isCash: false,
          label: '잔고 대비 현재 구매 가능한 수량',
          value: `${maxBuyableAmount}개`,
          inline: false,
        }),
      ],
      submitButtonLabel:
        BigInt(maxBuyableAmount) > 0 ? '구매하기' : '구매불가 (현금 부족)',
      isSubmitButtonDisabled: BigInt(maxBuyableAmount) > 0 ? false : true,
      submitSkillRouteURL: getSkillRoutePath(
        D1ScenarioRoutes.skillGroups.stock.skills.buyMore,
      ),
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stock.skills.index)
  async indexDraw(
    props: DiceUserActivitySkillDrawPropsType<
      MethodReturnType<StockService, 'index'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: drawDiceUserActivityMessage(props.userActivity),
      actionResultDrawings: [
        PlainMessage({
          thumbnail: {
            altName: '주식 칸 일러스트',
            imageUrl: getStopImageUrl(
              D1ScenarioRoutes.skillGroups.stock.skillGroupName,
            ),
          },
          title: `${this.getSkillGroupAlias()} 칸`,
          description:
            '주식 칸에 도착했습니다. 이 칸에서는 주식을 사거나, 보유중인 주식을 처분할 수 있습니다.',
        }),
        ...(props.skillServiceResult.buyable ==
          StockOwningStatusEnum.NOT_OWNING_STOCK &&
        props.skillServiceResult.stocks != undefined
          ? [
              PlainMessage({
                title: '주식 구매 가능',
                description: `보유중인 주식이 없으시군요! 주식을 구매하시겠습니까?`,
              }),
              props.skillServiceResult.stocks.map((stock) =>
                FormMessage({
                  title: `${stock.stockName} 주식 구매하기`,
                  description: stock.stockTicker,
                  inputFields: [
                    InputField({
                      label: '구매량',
                      name: 'amount',
                      placeholder:
                        BigInt(stock.maxBuyableAmount) > 0
                          ? `1 이상, ${BigInt(
                              stock.maxBuyableAmount,
                            ).toLocaleString()} 이하`
                          : '구매 불가',
                      maxNumber: stock.maxBuyableAmount,
                      minNumber: `${1}`,
                      type: 'number',
                      isDisabled:
                        BigInt(stock.maxBuyableAmount) > 0 ? false : true,
                    }),
                    InputField({
                      label: 'stockId',
                      name: 'stockId',
                      type: 'string',
                      isHidden: true,
                      defaultValue: stock.id,
                    }),
                  ],
                  dataFields: [
                    DataField({
                      isCash: false,
                      label: '이름',
                      value: stock.stockName,
                      inline: true,
                    }),
                    DataField({
                      isCash: true,
                      label: '1주당 가격',
                      value: String(stock.stockStartingPrice),
                      inline: true,
                    }),
                    DataField({
                      isCash: false,
                      label: '더블 시 주가 증감',
                      value: `↑${cashLocale(
                        BigInt(stock.stockRisingPrice),
                      )} ↓${cashLocale(BigInt(stock.stockFallingPrice))}`,
                      inline: true,
                    }),
                    DataField({
                      isCash: false,
                      label: '잔고 대비 현재 구매 가능한 수량',
                      value: `${BigInt(stock.maxBuyableAmount)}개`,
                      inline: false,
                    }),
                  ],
                  submitButtonLabel:
                    BigInt(stock.maxBuyableAmount) > 0
                      ? '구매하기'
                      : '구매불가 (현금 부족)',
                  isSubmitButtonDisabled:
                    BigInt(stock.maxBuyableAmount) > 0 ? false : true,
                  submitSkillRouteURL: getSkillRoutePath(
                    D1ScenarioRoutes.skillGroups.stock.skills.buy,
                  ),
                }),
              ),
              PlainMessage({
                title: '주식: 규칙',
                description: `- "1주당 금액"이 ${cashLocale(
                  1000,
                )} 이하로 폭락하면 강제로 판매됩니다. \n - 주식은 1종류만 구매 가능합니다. \n - "더블 시 주가 증감"이란? 주사위를 굴렸을 때, 동일한 주사위 눈이 나오면 주가가 "더블 시 주가 증감" 값에 맞춰 바뀝니다. 눈이 짝수면 오르고, 눈이 홀수면 떨어집니다.`,
              }),
            ]
          : [
              PlainMessage({
                description: `주식을 더 구매하거나 처분할 수 있습니다. \n${
                  props.skillServiceResult.status!.stockName
                } 주식을 더 구매하시겠습니까?`,
              }),
              this.stockBuyMoreFormMessage(
                props.skillServiceResult.status!,
                BigInt(props.skillServiceResult.maxBuyableAmount! || 0),
              ),
              LinkGroup({
                description: `또는, 주식을 처분하시겠습니까? 처분하면 현금으로 ${cashLocale(
                  BigInt(props.skillServiceResult.status!.stockAmount || 0) *
                    BigInt(
                      props.skillServiceResult.status!.stockCurrentPrice || 0,
                    ),
                )} 지급됩니다. \n물론 나중에 처분해도 됩니다.`,
                type: 'linkGroup',
                links: [
                  Link({
                    displayText: '주식 모두 처분하기',
                    skillRouteURL: getSkillRoutePath(
                      D1ScenarioRoutes.skillGroups.stock.skills.sell,
                    ),
                    param: {},
                  }),
                ],
              }),
            ]),
      ],
    });
  }

  @Skill(D1ScenarioRoutes.skillGroups.stock.skills.buy)
  buy(props: SkillPropsType<InteractionUserActivity<StockBuySubmitDto>>) {
    return this.skillService.buy({
      ...props,
      stockId: Number(props.userActivity.params.stockId) as StockIdType,
      amount: BigInt(props.userActivity.params.amount),
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stock.skills.buy)
  buyDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<StockService, 'buy'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: [
        UserActivityMessage({
          title: `${props.skillServiceResult.stockName} 주식 구매`,
          description: `${props.skillServiceResult.stockAmount}주 구매`,
          type: 'interactionUserActivityMessage',
        }),
      ],
      actionResultDrawings: [
        PlainMessage({
          title: '주식 매입 완료',
          description: `${props.skillServiceResult.stockName} 주식을 ${props.skillServiceResult.stockAmount}주 구매했습니다.`,
        }),
      ],
    });
  }

  @Skill(D1ScenarioRoutes.skillGroups.stock.skills.buyMore)
  buyMore(
    props: SkillPropsType<InteractionUserActivity<StockBuyMoreSubmitDto>>,
  ) {
    return this.skillService.buyMore({
      ...props,
      amount: BigInt(props.userActivity.params.amount),
    });
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stock.skills.buyMore)
  buyMoreDraw(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<StockService, 'buyMore'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: [
        UserActivityMessage({
          title: `${props.skillServiceResult.stockName} 주식 구매`,
          description: `${props.skillServiceResult.stockBoughtAmount}주 구매`,
          type: 'interactionUserActivityMessage',
        }),
      ],
      actionResultDrawings: [
        PlainMessage({
          title: '주식 추가 매입 완료',
          description: `${
            props.skillServiceResult.stockName
          } 주식을 ${cashLocale(props.skillServiceResult.stockPrice)}에 ${
            props.skillServiceResult.stockBoughtAmount
          }주 추가 구매했습니다.`,
        }),
      ],
    });
  }

  @Skill(D1ScenarioRoutes.skillGroups.stock.skills.sell)
  async sell(props: SkillPropsType<InteractionUserActivity>) {
    return this.skillService.sell(props);
  }

  @SkillDraw(D1ScenarioRoutes.skillGroups.stock.skills.sell)
  async drawSell(
    props: InteractionUserActivitySkillDrawPropsType<
      MethodReturnType<StockService, 'sell'>
    >,
  ) {
    return MessageResponseFactory({
      date: props.date,
      userRequestDrawings: [
        UserActivityMessage({
          title: `${props.skillServiceResult.stockName} 주식 처분`,
          type: 'interactionUserActivityMessage',
        }),
      ],
      actionResultDrawings: [
        PlainMessage({
          title: '주식 처분 완료',
          description: `${
            props.skillServiceResult.stockName
          } 주식을 처분하였습니다. ${cashLocale(
            props.skillServiceResult.stockSold,
          )} 받았습니다. \n이제 잔고가 ${cashLocale(
            props.skillServiceResult.userCash,
          )} 입니다.`,
        }),
      ],
    });
  }
}
