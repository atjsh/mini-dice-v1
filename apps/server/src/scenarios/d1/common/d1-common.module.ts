import { Module } from '@nestjs/common';
import { CommonLandModule } from './land/land.module';
import { CommonStockModule } from './stock/stock.module';

@Module({
  imports: [CommonLandModule, CommonStockModule],
})
export class D1CommonModule {}
