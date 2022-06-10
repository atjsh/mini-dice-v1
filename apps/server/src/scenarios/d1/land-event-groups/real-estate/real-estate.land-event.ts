import { Injectable, Module } from '@nestjs/common';
import { cashLocale, NotificationMessage } from '@packages/shared-types';
import {
  LandEventDraw,
  LandEventsSummarize,
} from 'apps/server/src/skill-group-lib/skill-service-lib';
import {
  LandEventDrawPropsType,
  LandEventDrawResultType,
  LandEventsSummarizePropsType,
  LandEventsSummarizeResultType,
} from 'apps/server/src/skill-log/types/skill-draw-props.dto';
import { D1ScenarioRoutes } from '../../routes';
import * as _ from 'lodash';

export class RealEstateEarnedLandEventResult {
  earnedCash: number;
  visitorUsername: string;
  landName: string;
}

export class RealEstateTakenOverLandEventResult {
  takenOverByUsername: string;
  landName: string;
}

@Injectable()
export class RealEstateLandEventGroup {
  @LandEventDraw(D1ScenarioRoutes.skillGroups.landEventRealEstate.skills.earned)
  earnedDraw(
    props: LandEventDrawPropsType<RealEstateEarnedLandEventResult>,
  ): LandEventDrawResultType {
    return NotificationMessage({
      title: '토지 수익 발생',
      description: `'${props.landEventResult.visitorUsername}' 유저가 내 '${
        props.landEventResult.landName
      }' 토지를 방문하여 통행료를 지불했습니다. 통행료 ${cashLocale(
        props.landEventResult.earnedCash,
      )} 받았습니다.`,
      date: String(props.date),
    });
  }

  @LandEventsSummarize(
    D1ScenarioRoutes.skillGroups.landEventRealEstate.skills.earned,
  )
  earnedSummarize(
    props: LandEventsSummarizePropsType<RealEstateEarnedLandEventResult>,
  ): LandEventsSummarizeResultType {
    const totalEarnedCash = _.sum(
      props.map((r) => r.landEventResult.earnedCash),
    );

    return {
      cashChangeAmount: BigInt(totalEarnedCash),
      summaryText: `${
        props.length
      }명의 유저가 내 토지에 방문했습니다. 통행료로 총 ${cashLocale(
        totalEarnedCash,
      )} 벌어들였습니다.`,
    };
  }

  @LandEventDraw(
    D1ScenarioRoutes.skillGroups.landEventRealEstate.skills.takenOver,
  )
  takenOverDraw(
    props: LandEventDrawPropsType<RealEstateTakenOverLandEventResult>,
  ): LandEventDrawResultType {
    return NotificationMessage({
      title: '다른 유저가 내 토지를 차지했음',
      description: `보유 시간이 지난 내 '${props.landEventResult.takenOverByUsername}' 토지를 '${props.landEventResult.landName}' 유저가 소유하게 되었습니다.`,
      date: String(props.date),
    });
  }

  @LandEventsSummarize(
    D1ScenarioRoutes.skillGroups.landEventRealEstate.skills.takenOver,
  )
  takenOverSummarize(
    props: LandEventsSummarizePropsType<RealEstateTakenOverLandEventResult>,
  ): LandEventsSummarizeResultType {
    return {
      cashChangeAmount: BigInt(0),
      summaryText: `보유 시간이 지난 내 ${props
        .map((r) => `'${r.landEventResult.landName}'`)
        .join(', ')} 토지를 다른 유저에게 뺏겼습니다. `,
    };
  }
}

@Module({
  providers: [RealEstateLandEventGroup],
})
export class RealEstateLandEventModule {}
