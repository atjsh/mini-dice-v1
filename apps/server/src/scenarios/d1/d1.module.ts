import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { D1CommonModule } from './common/d1-common.module';
import { D1Controller } from './d1.controller';
import { D1SkillGroupsModule } from './skill-groups/skill-groups.module';

@Module({
  imports: [DiscoveryModule, D1CommonModule, D1SkillGroupsModule],
  controllers: [D1Controller],
})
export class D1Module {}
