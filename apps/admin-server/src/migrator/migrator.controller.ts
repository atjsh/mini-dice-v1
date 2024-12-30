import { Controller, Post } from '@nestjs/common';
import { MigratorServicce } from './migrator.service';

@Controller('migrator')
export class MigratorController {
  constructor(private readonly migratorService: MigratorServicce) {}

  @Post('migrate')
  public async migrateData() {
    await this.migratorService.migrateData();
  }

  @Post('issue-specific/skill-log')
  public async migrateIssueSpecificSkillLog() {
    await this.migratorService.migrateIssueSpecificData();
  }
}
