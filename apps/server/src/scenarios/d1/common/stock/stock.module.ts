import { Module } from '@nestjs/common';
import { CommonStockService } from './stock.service';

@Module({
  providers: [CommonStockService],
  exports: [CommonStockService],
})
export class CommonStockModule {}
