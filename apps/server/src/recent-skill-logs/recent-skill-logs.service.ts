import { Injectable } from '@nestjs/common';
import { getSkillRouteFromPath } from '@packages/scenario-routing';
import { MessageResponseType, UserIdType } from '@packages/shared-types';
import { v4 as uuidv4 } from 'uuid';
import { ExposedSkillLogType } from '../dice-toss/interface';
import { ScenarioRouteCallService } from '../scenario-route-call/scenario-route-call.service';
import { D1ScenarioRoutes } from '../scenarios/d1/routes';
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
            },
          );
        console.log(skillDrawResult);

        return {
          skillDrawResult: skillDrawResult,
          id: skillLog.id,
        };
      }),
    );
  }

  async getLatestSkill(userId: UserIdType) {
    const recentSkillLogs = await this.skillLogsService.getLatestLog({
      userId,
      limit: 1,
    });

    if (recentSkillLogs.length > 0) {
      const skillRoute = recentSkillLogs[0].skillRoute;

      return {
        skillRoute: getSkillRouteFromPath(skillRoute),
        id: recentSkillLogs[0].id,
      };
    }

    return {
      skillRoute: D1ScenarioRoutes.skillGroups.mapStarter.skills.index,
      id: uuidv4(),
    };
  }
}
