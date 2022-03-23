import { Module } from '@nestjs/common';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { RecentSkillLogsController } from './recent-skill-logs.controller';
import { RecentSkillLogsService } from './recent-skill-logs.service';

@Module({
  imports: [SkillLogModule, ScenarioRouteCallModule],
  controllers: [RecentSkillLogsController],
  providers: [RecentSkillLogsService],
})
export class RecentSkillLogsModule {}
