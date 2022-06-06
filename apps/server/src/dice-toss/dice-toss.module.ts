import { Module } from '@nestjs/common';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { CommonStockModule } from '../scenarios/d1/common/stock/stock.module';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { UserActivityModule } from '../user-activity/user-activity.module';
import { DiceTossController } from './dice-toss.controller';
import { DiceTossService } from './dice-toss.service';

@Module({
  imports: [
    ScenarioRouteCallModule,
    SkillLogModule,
    CommonStockModule,
    UserActivityModule,
  ],
  controllers: [DiceTossController],
  providers: [DiceTossService],
})
export class DiceTossModule {}
