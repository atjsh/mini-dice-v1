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
import { PartTimeWorkModule } from './part-time-work/part-time-work.module';
import { BookModule } from './book/book.module';
import { LotteryModule } from './lottery/lottery.module';
import { FastCarModule } from './fast-car/fast-car.module';
import { GameDevModule } from './game-dev/game-dev.module';
import { PickedItemModule } from './picked-item/picked-item.module';
import { FireModule } from './fire/fire.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    MapStarterModule,
    CarAccidentModule,
    RpsModule,
    NightFoodModule,
    Land1Module,
    GameDevModule,
    PickedItemModule,
    FireModule,
    StockModule,
    LotteryModule,
    Land2Module,
    Land3Module,
    PartTimeWorkModule,
    Land4Module,
    BookModule,
    Land5Module,
    DragonMoneyModule,
    FastCarModule,
    Land6Module,
  ],
})
export class D1SkillGroupsModule {}
