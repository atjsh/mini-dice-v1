import { Module } from '@nestjs/common';
import { CommonLandModule } from './land/land.module';
import { CommonMinigameModule } from './minigame/minigame.module';
import { CommonMoneyCollectionModule } from './money-collection/common-money-collection.module';
import { CommonStockModule } from './stock/stock.module';

@Module({
  imports: [
    CommonLandModule,
    CommonStockModule,
    CommonMoneyCollectionModule,
    CommonMinigameModule,
  ],
})
export class D1CommonModule {}
