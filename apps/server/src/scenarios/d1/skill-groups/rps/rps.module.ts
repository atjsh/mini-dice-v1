import { Module } from '@nestjs/common';
import { RpsService } from './rps.service';
import { RpsSkillGroup } from './rps.skillgroup';

@Module({
  providers: [RpsSkillGroup, RpsService],
})
export class RpsModule {}
