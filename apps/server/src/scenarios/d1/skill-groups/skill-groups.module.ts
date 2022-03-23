import { Module } from '@nestjs/common';
import { MapStarterModule } from './map-starter/map-starter.module';
import { CarAccidentModule } from './car-accident/car-accident.module';
import { RpsModule } from './rps/rps.module';
import { NightFoodModule } from './night-food/night-food.module';
import { Land1Module } from './land1/land1.module';

@Module({
  imports: [
    MapStarterModule,
    CarAccidentModule,
    RpsModule,
    NightFoodModule,
    Land1Module,
  ],
})
export class D1SkillGroupsModule {}
