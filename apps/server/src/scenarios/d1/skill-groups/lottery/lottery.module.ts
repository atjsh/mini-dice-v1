import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotterySkillGroup } from './lottery.skillgroup';

@Module({
  providers: [LotteryService, LotterySkillGroup],
})
export class LotteryModule {}
