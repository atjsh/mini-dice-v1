import { Controller, Get } from '@nestjs/common';
import { MigratorServicce } from './migrator.service';

@Controller('migrator')
export class MigratorController {
  constructor(private readonly migratorService: MigratorServicce) {}

  @Get()
  public async migrateData() {
    await this.migratorService.migrateData();
  }

  @Get('issue-specific/skill-log')
  public async migrateIssueSpecificSkillLog() {
    await this.migratorService.migrateIssueSpecificData();
  }
}
