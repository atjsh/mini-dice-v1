import { Module } from '@nestjs/common';
import { UserModule } from 'apps/server/src/user/user.module';
import { CommonStockService } from './stock.service';

@Module({
  imports: [UserModule],
  providers: [CommonStockService],
})
export class CommonStockModule {}
