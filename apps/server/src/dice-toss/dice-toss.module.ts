import { Global, Module } from '@nestjs/common';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { CommonStockModule } from '../scenarios/d1/common/stock/stock.module';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { UserActivityModule } from '../user-activity/user-activity.module';
import { UserLandCommentModule } from '../user-land-comment/user-land-comment.module';
import { DiceTossController } from './dice-toss.controller';
import { DiceTossService } from './dice-toss.service';

@Global()
@Module({
  imports: [
    ScenarioRouteCallModule,
    SkillLogModule,
    CommonStockModule,
    UserActivityModule,
    UserLandCommentModule,
    UserLandCommentModule,
  ],
  controllers: [DiceTossController],
  providers: [DiceTossService],
  exports: [DiceTossService],
})
export class DiceTossModule {}
