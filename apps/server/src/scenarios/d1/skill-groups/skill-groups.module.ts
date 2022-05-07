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
import { StockUpModule } from './stock-up/stock-up.module';
import { StockDownModule } from './stock-down/stock-down.module';
import { PickedWalletModule } from './picked-wallet/picked-wallet.module';
import { MoneyCollection1Module } from './money-collection-1/money-collection-1.module';
import { MoneyCollection2Module } from './money-collection-2/money-collection-2.module';
import { MoneyCollection3Module } from './money-collection-3/money-collection-3.module';

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
    PickedWalletModule,
    MoneyCollection2Module,
    BookModule,
    Land5Module,
    MoneyCollection3Module,
    DragonMoneyModule,
    FastCarModule,
    StockUpModule,
    StockDownModule,
    Land6Module,
    MoneyCollection1Module,
  ],
})
export class D1SkillGroupsModule {}
