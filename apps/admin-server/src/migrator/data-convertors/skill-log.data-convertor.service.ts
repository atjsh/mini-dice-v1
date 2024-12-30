import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { MySQLSkillLogEntity } from '../../entities/mysql/mysql-skill-log.entity';
import { PgSkillLogEntity } from '../../entities/postgresql/pg-skill-log.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';

const CONVERT_SKILL_LOGS_BATCH_SIZE = 10000;

@Injectable()
export class SkillLogDataConvertorService {
  constructor(
    @InjectRepository(MySQLSkillLogEntity, DATASOURCE_NAMES.MYSQL)
    private readonly mysqlSkillLogRepository: Repository<MySQLSkillLogEntity>,

    @InjectRepository(PgSkillLogEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgSkillLogRepository: Repository<PgSkillLogEntity>,
  ) {}

  public async convertSkillLogs(
    convertedUsersMap: ConvertedUsersMap,
  ): Promise<void> {
    const totalCount = await this.mysqlSkillLogRepository.count();
    let offset = 0;
    let done = 0;

    while (done < totalCount) {
      const skillLogs = await this.getSkillLogsBatch(offset);

      await this.convertAndInsertSkillLogsPerBatch(
        skillLogs,
        convertedUsersMap,
      );

      done += skillLogs.length;
      offset += CONVERT_SKILL_LOGS_BATCH_SIZE;

      console.log({
        done,
        offset,
        totalCount,
      });
    }

    console.log('Skill logs migrated');
    console.log({
      done,
      offset,
      totalCount,
    });
  }

  private async getSkillLogsBatch(offset: number) {
    return this.mysqlSkillLogRepository.find({
      take: CONVERT_SKILL_LOGS_BATCH_SIZE,
      skip: offset,
      transaction: false,
    });
  }

  private async convertAndInsertSkillLogsPerBatch(
    skillLogs: MySQLSkillLogEntity[],
    convertedUsersMap: ConvertedUsersMap,
  ): Promise<void> {
    const newSkillLogs = skillLogs.map((skillLog) =>
      this.convertSkillLog(skillLog, convertedUsersMap),
    );

    await this.pgSkillLogRepository.save(newSkillLogs, { transaction: false });
  }

  private convertSkillLog(
    skillLog: MySQLSkillLogEntity,
    convertedUsersMap: ConvertedUsersMap,
  ): PgSkillLogEntity {
    const newSkillLog = new PgSkillLogEntity();

    newSkillLog.userId = convertedUsersMap[skillLog.userId];
    newSkillLog.skillRoute = skillLog.skillRoute;
    newSkillLog.userActivity = skillLog.userActivity;
    newSkillLog.skillServiceResult = skillLog.skillServiceResult;
    newSkillLog.createdAt = skillLog.date;

    return newSkillLog;
  }
}
