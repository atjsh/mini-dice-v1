import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { SkillGroupAliasesModule } from '../../skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { D1CommonModule } from './common/d1-common.module';
import { D1Controller } from './d1.controller';
import { D1LandEventModule } from './land-event-groups/land-event.module';
import { D1SkillGroupsModule } from './skill-groups/skill-groups.module';

@Module({
  imports: [
    DiscoveryModule,
    D1CommonModule,
    D1LandEventModule,
    D1SkillGroupsModule,
    SkillGroupAliasesModule,
  ],
  controllers: [D1Controller],
})
export class D1Module {}
