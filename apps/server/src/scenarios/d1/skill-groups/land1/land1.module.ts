import { Module } from '@nestjs/common';
import { Land1Service } from './land1.service';
import { Land1SkillGroup } from './land1.skillgroup';
import { CommonLandModule } from '../../common/land/land.module';

@Module({
  imports: [CommonLandModule],
  providers: [Land1SkillGroup, Land1Service],
})
export class Land1Module {}
