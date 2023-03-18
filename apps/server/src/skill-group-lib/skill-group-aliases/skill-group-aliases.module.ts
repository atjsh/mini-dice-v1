import { Module } from '@nestjs/common';
import { SkillGroupAliasesService } from './skill-group-aliases.service';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';

@Module({
  imports: [DiscoveryModule],
  providers: [SkillGroupAliasesService],
  exports: [SkillGroupAliasesService],
})
export class SkillGroupAliasesModule {}
