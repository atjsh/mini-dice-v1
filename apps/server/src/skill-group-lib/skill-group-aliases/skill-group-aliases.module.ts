import { Module } from '@nestjs/common';
import { SkillGroupAliasesService } from './skill-group-aliases.service';

@Module({
  providers: [SkillGroupAliasesService],
  exports: [SkillGroupAliasesService],
})
export class SkillGroupAliasesModule {}
