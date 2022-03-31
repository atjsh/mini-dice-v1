import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land5Service } from './land5.service';
import { Land5SkillGroup } from './land5.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land5SkillGroup, Land5Service],
})
export class Land5Module {}
