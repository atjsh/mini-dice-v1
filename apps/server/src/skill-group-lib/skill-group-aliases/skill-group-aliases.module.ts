import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { SkillGroupAliasesService } from './skill-group-aliases.service';

@Module({
  imports: [DiscoveryModule],
  providers: [SkillGroupAliasesService],
  exports: [SkillGroupAliasesService],
})
export class SkillGroupAliasesModule {}
