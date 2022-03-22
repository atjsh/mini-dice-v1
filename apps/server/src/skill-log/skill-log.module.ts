import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillLogService } from './skill-log.service';
import { SkillLogEntity } from './entity/skill-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkillLogEntity])],
  providers: [SkillLogService],
  exports: [SkillLogService],
})
export class SkillLogModule {}
