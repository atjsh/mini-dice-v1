import { Module } from '@nestjs/common';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { DiceTossController } from './dice-toss.controller';
import { DiceTossService } from './dice-toss.service';

@Module({
  imports: [ScenarioRouteCallModule, SkillLogModule],
  controllers: [DiceTossController],
  providers: [DiceTossService],
})
export class DiceTossModule {}
