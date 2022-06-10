import { Module } from '@nestjs/common';
import { UserInteractionWebService } from './user-interaction-web.service';
import { UserInteractionWebController } from './user-interaction-web.controller';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { UserActivityModule } from '../user-activity/user-activity.module';

@Module({
  imports: [ScenarioRouteCallModule, SkillLogModule, UserActivityModule],
  controllers: [UserInteractionWebController],
  providers: [UserInteractionWebService],
})
export class UserInteractionWebModule {}
