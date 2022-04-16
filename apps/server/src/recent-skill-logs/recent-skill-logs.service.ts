import { Injectable } from '@nestjs/common';
import { getSkillRouteFromPath } from '@packages/scenario-routing';
import { MessageResponseType, UserIdType } from '@packages/shared-types';
import { ExposedSkillLogType } from '../dice-toss/interface';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import { SkillLogService } from '../skill-log/skill-log.service';

@Injectable()
export class RecentSkillLogsService {
  constructor(
    private scenarioRoutingService: ScenarioRouteCallService,
    private skillLogsService: SkillLogService,
  ) {}

  async getRecentSkillLogsWeb(
    userId: UserIdType,
    limit: number,
    timezone: string,
  ): Promise<ExposedSkillLogType[]> {
    const recentSkillLogs = await this.skillLogsService.getLatestLog({
      userId,
      limit: limit,
    });
    return await Promise.all(
      recentSkillLogs.map(async (skillLog) => {
        const skillDrawResult =
          await this.scenarioRoutingService.callSkillDraw<MessageResponseType>(
            getSkillRouteFromPath(skillLog.skillRoute),
            {
              date: skillLog.date,
              skillServiceResult: skillLog.skillServiceResult,
              userActivity: skillLog.userActivity,
              timezone: timezone,
            },
          );

        return {
          skillDrawResult: skillDrawResult,
          id: skillLog.id,
          skillRoute: getSkillRouteFromPath(skillLog.skillRoute),
        };
      }),
    );
  }
}
