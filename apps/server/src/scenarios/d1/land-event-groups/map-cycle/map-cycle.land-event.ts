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
import * as _ from 'lodash';
import { getStopImageUrl } from '../../../scenarios.commons';
import { D1ScenarioRoutes } from '../../routes';

export class MapCycleLandEventResult {
  earnedCash: number;
}

@Injectable()
export class MapCycleLandEventService {}

@Injectable()
export class MapCycleLandEventGroup {
  @LandEventDraw(
    D1ScenarioRoutes.skillGroups.landEventMapCycle.skills.earnedCash,
  )
  earnedCashDraw(
    props: LandEventDrawPropsType<MapCycleLandEventResult>,
  ): LandEventDrawResultType {
    return NotificationMessage({
      title: '맵 돌기',
      description: `맵을 한바퀴 돌았습니다! 보상으로 ${cashLocale(
        props.landEventResult.earnedCash,
      )} 받았습니다.`,
      date: String(props.date),
      thumbnail: {
        imageUrl: getStopImageUrl('mapStarter'),
        altName: '맵 돌기',
      },
    });
  }

  @LandEventsSummarize(
    D1ScenarioRoutes.skillGroups.landEventMapCycle.skills.earnedCash,
  )
  earnedCashSummarize(
    props: LandEventsSummarizePropsType<MapCycleLandEventResult>,
  ): LandEventsSummarizeResultType {
    const totalEarnedCash = _.sum(
      props.map((r) => r.landEventResult.earnedCash),
    );
    return {
      summaryText: `맵을 한바퀴 돌았습니다! 보상으로 ${cashLocale(
        totalEarnedCash,
      )} 받았습니다.`,
      cashChangeAmount: BigInt(totalEarnedCash),
    };
  }
}

@Module({ providers: [MapCycleLandEventService, MapCycleLandEventGroup] })
export class MapCycleLandEventModule {}
