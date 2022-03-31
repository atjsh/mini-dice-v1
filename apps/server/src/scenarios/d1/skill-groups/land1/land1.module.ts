import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land1Service } from './land1.service';
import { Land1SkillGroup } from './land1.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land1SkillGroup, Land1Service],
})
export class Land1Module {}
