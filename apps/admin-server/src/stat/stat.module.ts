import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgSkillLogEntity } from '../entities/postgresql/pg-skill-log.entity';
import { PgStatCashAggrigationEntity } from '../entities/postgresql/pg-stat-cash-aggrigation.entity';
import { PgStatCashTimeSeriesEntity } from '../entities/postgresql/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from '../entities/postgresql/pg-stat-stock-time-series.entity';
import { PgUserEntity } from '../entities/postgresql/pg-user.entity';
import { StatInitService } from './stat-init/stat-init.service';
import { StatController } from './stat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        PgUserEntity,
        PgSkillLogEntity,
        PgStatCashTimeSeriesEntity,
        PgStatStockTimeSeriesEntity,
        PgStatCashAggrigationEntity,
      ],
      DATASOURCE_NAMES.POSTGRESQL,
    ),
  ],
  providers: [StatInitService],
  controllers: [StatController],
})
export class StatModule {}
