import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { PgSkillLogEntity } from '../../entities/postgresql/pg-skill-log.entity';
import { PgStatCashAggrigationEntity } from '../../entities/postgresql/pg-stat-cash-aggrigation.entity';
import { PgStatCashTimeSeriesEntity } from '../../entities/postgresql/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from '../../entities/postgresql/pg-stat-stock-time-series.entity';
import { PgUserEntity } from '../../entities/postgresql/pg-user.entity';

type UserID = string;

@Injectable()
export class StatInitService {
  constructor(
    @InjectRepository(PgUserEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserEntityRepository: Repository<PgUserEntity>,

    @InjectRepository(PgSkillLogEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgSkillLogEntityRepository: Repository<PgSkillLogEntity>,

    @InjectRepository(PgStatCashTimeSeriesEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgStatCashTimeSeriesEntityRepository: Repository<PgStatCashTimeSeriesEntity>,

    @InjectRepository(PgStatStockTimeSeriesEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgStatStockTimeSeriesEntityRepository: Repository<PgStatStockTimeSeriesEntity>,

    @InjectRepository(PgStatCashAggrigationEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgStatCashAggrigationEntityRepository: Repository<PgStatCashAggrigationEntity>,
  ) {}

  public async initStatCashTimeSeries() {
    const users: Record<
      UserID,
      {
        cash: number;
        lastSkillLogId: string;
      }
    > = {};

    const jobProgress = {
      done: 0,
      total: 0,
      batchSize: 10000,
    };

    jobProgress.total = await this.pgSkillLogEntityRepository.count();

    while (jobProgress.done < jobProgress.total) {
      const skillLogs = await this.pgSkillLogEntityRepository.find({
        take: jobProgress.batchSize,
        skip: jobProgress.done,
      });
    }
  }

  //   모든 유저는 1000원에서 시작한다.
  // date로 검색, 각 유저가 검색될때마다 유저 cash를 변화시킴
  // stat 메타데이터 테이블도 필요할 듯? 언제 stat 만들었는지, 각 유저별 마지막 skillLog가 뭐였는지 등등등
}
