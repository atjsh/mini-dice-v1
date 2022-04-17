import { Module } from '@nestjs/common';
import { CommonStockModule } from '../../common/stock/stock.module';
import { StockDownService } from './stock-down.service';
import { StockDownSkillGroup } from './stock-down.skillgroup';

@Module({
  imports: [CommonStockModule],
  providers: [StockDownSkillGroup, StockDownService],
})
export class StockDownModule {}
