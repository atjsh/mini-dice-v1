import { Module } from '@nestjs/common';
import { CommonStockModule } from '../../common/stock/stock.module';
import { StockService } from './stock.service';
import { StockSkillGroup } from './stock.skillgroup';

@Module({
  imports: [CommonStockModule],
  providers: [StockService, StockSkillGroup],
})
export class StockModule {}
