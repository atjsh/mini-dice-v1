import { Module } from '@nestjs/common';
import { MapStarterModule } from './map-starter/map-starter.module';
import { CarAccidentModule } from './car-accident/car-accident.module';
import { RpsModule } from './rps/rps.module';
import { NightFoodModule } from './night-food/night-food.module';
import { Land1Module } from './land1/land1.module';
import { Land2Module } from './land2/land2.module';
import { Land3Module } from './land3/land3.module';
import { Land4Module } from './land4/land4.module';
import { Land5Module } from './land5/land5.module';
import { Land6Module } from './land6/land6.module';
import { DragonMoneyModule } from './dragon-money/dragon-money.module';

@Module({
  imports: [
    MapStarterModule,
    CarAccidentModule,
    RpsModule,
    NightFoodModule,
    Land1Module,
    Land2Module,
    Land3Module,
    Land4Module,
    Land5Module,
    DragonMoneyModule,
    Land6Module,
  ],
})
export class D1SkillGroupsModule {}
