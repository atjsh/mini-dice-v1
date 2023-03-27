import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScenarioRouteCallModule } from '../scenario-route-call/scenario-route-call.module';
import { LandEventController } from './land-event.controller';
import { LandEventRepository } from './land-event.repository';
import { UserActivityEntity } from './user-activity.entity';
import { UserActivityService } from './user-activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActivityEntity]),
    ScenarioRouteCallModule,
  ],
  providers: [UserActivityService, LandEventRepository],
  controllers: [LandEventController],
  exports: [UserActivityService, LandEventRepository],
})
export class UserActivityModule {}
