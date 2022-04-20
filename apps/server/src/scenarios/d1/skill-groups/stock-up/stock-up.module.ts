import { Module } from '@nestjs/common';
import { StockUpService } from './stock-up.service';
import { StockUpSkillGroup } from './stock-up.skillgroup';

@Module({
  providers: [StockUpSkillGroup, StockUpService],
})
export class StockUpModule {}
