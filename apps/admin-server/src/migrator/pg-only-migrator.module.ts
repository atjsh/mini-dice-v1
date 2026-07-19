import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgSkillLogEntity } from '../entities/postgresql/pg-skill-log.entity';
import { SkillLogCompressionService } from './issue-specific/skill-log-compression.service';
import { SkillLogDictionaryGeneratorService } from './issue-specific/skill-log-dictionary-generator.service';
import { PgOnlyMigratorController } from './pg-only-migrator.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgSkillLogEntity], DATASOURCE_NAMES.POSTGRESQL),
  ],
  providers: [SkillLogCompressionService, SkillLogDictionaryGeneratorService],
  controllers: [PgOnlyMigratorController],
  exports: [SkillLogCompressionService],
})
export class PgOnlyMigratorModule {}
