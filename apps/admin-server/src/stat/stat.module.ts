import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgStatCashTimeSeriesEntity } from '../entities/postgresql/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from '../entities/postgresql/pg-stat-stock-time-series.entity';
import { StatInitService } from './stat-init/stat-init.service';
import { StatController } from './stat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [PgStatCashTimeSeriesEntity, PgStatStockTimeSeriesEntity],
      DATASOURCE_NAMES.POSTGRESQL,
    ),
  ],
  providers: [StatInitService],
  controllers: [StatController],
})
export class StatModule {}
