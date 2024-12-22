import { Module } from '@nestjs/common';
import { CommonRpsgameModule } from '../../common/rpsgame/common-rpsgame.module';
import { RpsService } from './rps.service';
import { RpsSkillGroup } from './rps.skillgroup';

@Module({
  imports: [CommonRpsgameModule],
  providers: [RpsSkillGroup, RpsService],
})
export class RpsModule {}
