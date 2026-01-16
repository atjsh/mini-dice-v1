import { Injectable } from '@nestjs/common';
import {
  LandEventsSummarizeMetadataKey,
  getSkillRouteFromPath,
} from '@packages/scenario-routing';
import type { NotificationMessageType } from '@packages/shared-types';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../config/enviorment-variable-config';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import type { LandEventsSummarizeResultType } from '../skill-log/types/skill-draw-props.dto';
import {
  LandEventRepository,
  type CreateUserActivityInputDto,
  type SearchUserActivityByDateInputDto,
  type SearchUserActivityByPageInputDto,
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
    private pushNotificationService: PushNotificationService,
    private configService: ConfigService,
  ) {}

  async create<LandEventResult extends Record<string, any>>(
    createUserActivityInputDto: CreateUserActivityInputDto<LandEventResult>,
  ) {
    const landEvent = await this.userActivityRepository.createLandEvent(
      createUserActivityInputDto,
    );

    // Send push notification asynchronously (don't await)
    this.sendPushNotificationForLandEvent(
      createUserActivityInputDto.userId,
      landEvent.skillRoute,
    ).catch((error) => {
      console.error('Failed to send push notification:', error);
    });

    return landEvent;
  }

  private async sendPushNotificationForLandEvent(
    userId: string,
    skillRoute: string,
  ): Promise<void> {
    try {
      const webUrl = this.configService.getOrThrow(ENV_KEYS.WEB_URL);
      const notificationCenterUrl = `${webUrl}/notification-center`;

      await this.pushNotificationService.sendNotificationToUser(userId, {
        title: 'Mini Dice - 새로운 알림',
        body: '새로운 이벤트가 발생했습니다!',
        navigate: notificationCenterUrl,
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  async renderRecentLandEvent(
    searchUserActivityByPageInputDto: SearchUserActivityByPageInputDto,
    timezone: string,
  ): Promise<NotificationMessageType[]> {
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
