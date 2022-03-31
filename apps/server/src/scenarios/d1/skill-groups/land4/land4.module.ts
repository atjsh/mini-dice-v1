import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land4Service } from './land4.service';
import { Land4SkillGroup } from './land4.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land4SkillGroup, Land4Service],
})
export class Land4Module {}
