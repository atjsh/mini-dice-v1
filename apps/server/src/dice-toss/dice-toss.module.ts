import { Module } from '@nestjs/common';
import { DiceTossController } from './dice-toss.controller';
import { DiceTossService } from './dice-toss.service';

@Module({
  controllers: [DiceTossController],
  providers: [DiceTossService],
})
export class DiceTossModule {}
