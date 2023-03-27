import { Injectable, Module } from '@nestjs/common';
import { NotificationMessage, cashLocale } from '@packages/shared-types';
import {
  LandEventDraw,
  LandEventsSummarize,
} from '../../../../skill-group-lib/skill-service-lib';
import type {
  LandEventDrawPropsType,
  LandEventDrawResultType,
  LandEventsSummarizePropsType,
  LandEventsSummarizeResultType,
} from '../../../../skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';

export class MoneyCollectionOtherUserReceivedCashLandEventResult {
  moneyCollectionName: string;
  otherUserUsername: string;
  earnedCash: number;
  participantHeadcount: number;
}

@Injectable()
export class MoneyCollectionLandEventGroup {
  @LandEventDraw(
    D1ScenarioRoutes.skillGroups.landEventMoneyCollection.skills
      .otherUserReceivedCash,
  )
  otherUserReceivedCashDraw(
    props: LandEventDrawPropsType<MoneyCollectionOtherUserReceivedCashLandEventResult>,
  ): LandEventDrawResultType {
    return NotificationMessage({
      title: `${props.landEventResult.moneyCollectionName} 현금 수령자 등장`,
      description: `${props.landEventResult.moneyCollectionName}에서 ${
        props.landEventResult.participantHeadcount
      }명이 모은 돈을 '${
        props.landEventResult.otherUserUsername
      }' 유저가 돈을 받아버렸습니다. 총 ${cashLocale(
        props.landEventResult.earnedCash,
      )} 받았대요.`,
      date: String(props.date),
    });
  }

  @LandEventsSummarize(
    D1ScenarioRoutes.skillGroups.landEventMoneyCollection.skills
      .otherUserReceivedCash,
  )
  otherUserReceivedCashSummarize(
    props: LandEventsSummarizePropsType<MoneyCollectionOtherUserReceivedCashLandEventResult>,
  ): LandEventsSummarizeResultType {
    return {
      cashChangeAmount: BigInt(0),
      summaryText: `${props
        .map((r) => r.landEventResult.moneyCollectionName)
        .join(', ')}에서 현금 수령자가 등장했습니다. 각각 ${props
        .map(
          (r) =>
            `'${r.landEventResult.otherUserUsername}' 유저가 ${
              r.landEventResult.participantHeadcount
            }명이 모은 ${cashLocale(r.landEventResult.earnedCash)}`,
        )
        .join(', ')} 수령했대요.`,
    };
  }
}

@Module({ providers: [MoneyCollectionLandEventGroup] })
export class MoneyCollectionLandEventModule {}
