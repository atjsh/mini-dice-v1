import { Module } from '@nestjs/common';
import { UserInteractionWebService } from './user-interaction-web.service';
import { UserInteractionWebController } from './user-interaction-web.controller';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';

@Module({
  imports: [ScenarioRouteCallModule, SkillLogModule],
  controllers: [UserInteractionWebController],
  providers: [UserInteractionWebService],
})
export class UserInteractionWebModule {}
