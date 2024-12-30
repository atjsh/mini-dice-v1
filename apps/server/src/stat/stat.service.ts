import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PgStatCashTimeSeriesEntity } from './entities/pg-stat-cash-time-series.entity';
import { Repository } from 'typeorm';
import { PgStatStockTimeSeriesEntity } from './entities/pg-stat-stock-time-series.entity';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(PgStatCashTimeSeriesEntity)
    private readonly statCashTimeSeriesRepository: Repository<PgStatCashTimeSeriesEntity>,

    @InjectRepository(PgStatStockTimeSeriesEntity)
    private readonly statStockTimeSeriesRepository: Repository<PgStatStockTimeSeriesEntity>,
  ) {}
}
