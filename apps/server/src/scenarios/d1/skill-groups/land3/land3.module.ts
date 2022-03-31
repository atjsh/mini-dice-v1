import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land3Service } from './land3.service';
import { Land3SkillGroup } from './land3.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land3SkillGroup, Land3Service],
})
export class Land3Module {}
