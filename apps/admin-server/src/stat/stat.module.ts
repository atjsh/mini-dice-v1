import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgStatCashTimeSeriesEntity } from '../entities/postgresql/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from '../entities/postgresql/pg-stat-stock-time-series.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [PgStatCashTimeSeriesEntity, PgStatStockTimeSeriesEntity],
      DATASOURCE_NAMES.POSTGRESQL,
    ),
  ],
})
export class StatModule {}
