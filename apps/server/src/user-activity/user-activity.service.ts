import { Injectable } from '@nestjs/common';
import {
  LandEventDrawMetadataKey,
  LandEventsSummarizeMetadataKey,
  getSkillRouteFromPath,
} from '@packages/scenario-routing';
import type { NotificationMessageType } from '@packages/shared-types';
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
  Element extends object,
  Key extends keyof Element,
> {
  data: Element[];
  groupedBy: Element[Key];
}

function groupBy<Element extends object, Key extends keyof Element>(
  elements: Element[],
  key: Key,
): GroupedArrayElements<Element, Key>[] {
  const groups = new Map<Element[Key], Element[]>();

  for (const element of elements) {
    const groupedBy = element[key];
    const group = groups.get(groupedBy) ?? [];
    group.push(element);
    groups.set(groupedBy, group);
  }

  return Array.from(groups, ([groupedBy, data]) => ({ groupedBy, data }));
}

@Injectable()
export class UserActivityService {
  constructor(
    private userActivityRepository: LandEventRepository,
    private scenarioRouteCallService: ScenarioRouteCallService,
    private pushNotificationService: PushNotificationService,
    private configService: ConfigService,
  ) {}

  async create<LandEventResult extends object>(
    createUserActivityInputDto: CreateUserActivityInputDto<LandEventResult>,
  ) {
    const landEvent = await this.userActivityRepository.createLandEvent(
      createUserActivityInputDto,
    );

    this.sendPushNotificationForLandEvent(
      createUserActivityInputDto.userId,
    ).catch((error) => {
      console.error('Failed to send push notification:', error);
    });

    return landEvent;
  }

  private async sendPushNotificationForLandEvent(userId: string) {
    const webUrl = this.configService.getOrThrow<string>(ENV_KEYS.WEB_URL);

    await this.pushNotificationService.sendNotificationToUser(userId, {
      title: 'Mini Dice - 새로운 알림',
      body: '새로운 이벤트가 발생했습니다!',
      navigate: `${webUrl}/notifications`,
    });
  }

  async renderRecentLandEvent(
    searchUserActivityByPageInputDto: SearchUserActivityByPageInputDto,
    timezone: string,
  ): Promise<NotificationMessageType[]> {
    const landEventLogs = await this.userActivityRepository.searchByPage(
      searchUserActivityByPageInputDto,
    );
    const callableLandEventLogs = await Promise.all(
      landEventLogs.map(async (landEventLog) => ({
        landEventLog,
        canCall: await this.scenarioRouteCallService.canCallBySkill(
          getSkillRouteFromPath(landEventLog.skillRoute),
          LandEventDrawMetadataKey,
        ),
      })),
    );

    return Promise.all(
      callableLandEventLogs
        .filter(({ canCall }) => canCall)
        .map(({ landEventLog }) =>
          this.scenarioRouteCallService.callLandEventDraw(
            getSkillRouteFromPath(landEventLog.skillRoute),
            {
              date: landEventLog.createdAt,
              landEventResult: landEventLog.skillDrawProps,
              timezone,
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

    const callableGroups = await Promise.all(
      groupedLandEventResultLogs.map(async (group) => ({
        group,
        canCall: await this.scenarioRouteCallService.canCallBySkill(
          getSkillRouteFromPath(group.groupedBy),
          LandEventsSummarizeMetadataKey,
        ),
      })),
    );

    return Promise.all(
      callableGroups
        .filter(({ canCall }) => canCall)
        .map(({ group }) =>
          this.scenarioRouteCallService.callLandEventsSummarize(
            getSkillRouteFromPath(group.groupedBy),
            group.data.map((landEventResultLog) => ({
              date: landEventResultLog.createdAt,
              landEventResult: landEventResultLog.skillDrawProps,
              timezone,
            })),
          ),
        ),
    );
  }
}
