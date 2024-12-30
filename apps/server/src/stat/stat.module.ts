import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgStatCashTimeSeriesEntity } from './entities/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from './entities/pg-stat-stock-time-series.entity';
import { StatService } from './stat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PgStatCashTimeSeriesEntity,
      PgStatStockTimeSeriesEntity,
    ]),
  ],
  providers: [StatService],
})
export class StatModule {}
