import { Controller, Post } from '@nestjs/common';
import { SkillLogCompressionService } from './issue-specific/skill-log-compression.service';
import { SkillLogDictionaryGeneratorService } from './issue-specific/skill-log-dictionary-generator.service';

@Controller('migrator')
export class PgOnlyMigratorController {
  constructor(
    private readonly skillLogCompressionService: SkillLogCompressionService,
    private readonly skillLogDictionaryGeneratorService: SkillLogDictionaryGeneratorService,
  ) {}

  @Post('issue-specific/skill-log/dictionary/dry-run')
  public async dryRunSkillLogDictionaryGeneration() {
    return await this.skillLogDictionaryGeneratorService.dryRun();
  }

  @Post('issue-specific/skill-log/dictionary/generate')
  public async generateSkillLogDictionary() {
    return await this.skillLogDictionaryGeneratorService.generateAndWrite();
  }

  @Post('issue-specific/skill-log/compress/dry-run')
  public async dryRunSkillLogCompression() {
    return await this.skillLogCompressionService.dryRun();
  }

  @Post('issue-specific/skill-log/compress/run')
  public async runSkillLogCompression() {
    return await this.skillLogCompressionService.run();
  }
}
