import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land6Service } from './land6.service';
import { Land6SkillGroup } from './land6.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land6SkillGroup, Land6Service],
})
export class Land6Module {}
