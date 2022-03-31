import { Module } from '@nestjs/common';
import { PartTimeWorkService } from './part-time-work.service';
import { PartTimeWorkSkillGroup } from './part-time-work.skillgroup';

@Module({
  providers: [PartTimeWorkSkillGroup, PartTimeWorkService],
})
export class PartTimeWorkModule {}
