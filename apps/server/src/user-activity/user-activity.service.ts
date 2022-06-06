import { Injectable } from '@nestjs/common';
import { getSkillRouteFromPath } from '@packages/scenario-routing';
import { LandEventsSummarizeMetadataKey } from '@packages/scenario-routing/constants';
import { PlainMessageType } from '@packages/shared-types';
import * as _ from 'lodash';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import { LandEventsSummarizeResultType } from '../skill-log/types/skill-draw-props.dto';
import {
  CreateUserActivityInputDto,
  LandEventRepository,
  SearchUserActivityByDateInputDto,
  SearchUserActivityByPageInputDto,
  SearchUserActivityOutputDto,
} from './land-event.repository';

interface GroupedArrayElements<
  Element extends Record<string, any>,
  Key extends keyof Element,
> {
  data: Element[];
  groupedBy: Element[Key];
}

function groupBy<
  Element extends Record<string, any>,
  Key extends keyof Element,
>(elements: Element[], key: Key): GroupedArrayElements<Element, Key>[] {
  return Object.entries(_.groupBy(elements, key)).map(([key, value]) => ({
    groupedBy: key as Element[Key],
    data: value,
  }));
}

@Injectable()
export class UserActivityService {
  constructor(
    private userActivityRepository: LandEventRepository,
    private scenarioRouteCallService: ScenarioRouteCallService,
  ) {}

  async create(createUserActivityInputDto: CreateUserActivityInputDto) {
    return await this.userActivityRepository.createLandEvent(
      createUserActivityInputDto,
    );
  }

  async renderRecentLandEvent(
    searchUserActivityByPageInputDto: SearchUserActivityByPageInputDto,
    timezone: string,
  ): Promise<PlainMessageType[]> {
    return await Promise.all(
      (
        await this.userActivityRepository.searchByPage(
          searchUserActivityByPageInputDto,
        )
      )
        .filter(
          async (groupedLandEventResultLog) =>
            await this.scenarioRouteCallService.canCallBySkill(
              getSkillRouteFromPath(groupedLandEventResultLog.skillRoute),
              LandEventsSummarizeMetadataKey,
            ),
        )
        .map(
          async (landEventResultLog) =>
            await this.scenarioRouteCallService.callLandEventDraw(
              getSkillRouteFromPath(landEventResultLog.skillRoute),
              {
                date: landEventResultLog.createdAt,
                landEventResult: landEventResultLog.skillDrawProps,
                timezone: timezone,
              },
            ),
        ),
    );
  }

  async getRecentLandEventSummaries(
    searchUserActivityByDateInputDto: SearchUserActivityByDateInputDto,
    timezone: string,
  ): Promise<LandEventsSummarizeResultType[]> {
    const landEventResultLogs = await this.userActivityRepository.searchByDate(
      searchUserActivityByDateInputDto,
    );
    const groupedLandEventResultLogs = groupBy(
      landEventResultLogs,
      'skillRoute',
    );

    return await Promise.all(
      groupedLandEventResultLogs
        .filter(
          async (groupedLandEventResultLog) =>
            await this.scenarioRouteCallService.canCallBySkill(
              getSkillRouteFromPath(groupedLandEventResultLog.groupedBy),
              LandEventsSummarizeMetadataKey,
            ),
        )
        .map(
          async (groupedLandEventResultLog) =>
            await this.scenarioRouteCallService.callLandEventsSummarize(
              getSkillRouteFromPath(groupedLandEventResultLog.groupedBy),
              groupedLandEventResultLog.data.map((landEventResultLog) => ({
                date: landEventResultLog.createdAt,
                landEventResult: landEventResultLog.skillDrawProps,
                timezone: timezone,
              })),
            ),
        ),
    );
  }
}
