import { Module } from '@nestjs/common';
import { CommonLandModule } from '../../common';
import { Land2Service } from './land2.service';
import { Land2SkillGroup } from './land2.skillgroup';

@Module({
  imports: [CommonLandModule],
  providers: [Land2SkillGroup, Land2Service],
})
export class Land2Module {}
