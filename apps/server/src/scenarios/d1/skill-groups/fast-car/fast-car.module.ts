import { Module } from '@nestjs/common';
import { FastCarService } from './fast-car.service';
import { FastCarSkillGroup } from './fast-car.skillgroup';

@Module({
  providers: [FastCarService, FastCarSkillGroup],
})
export class FastCarModule {}
