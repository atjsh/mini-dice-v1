import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_stat_stock_time_series',
})
@Index('TB_STAT_STOCK_TIME_SERIES_USER_ID_STOCK_ID_DATE_IDX', [
  'userId',
  'stockId',
  'date',
])
@Index('TB_STAT_STOCK_TIME_SERIES_USER_ID_STOCK_ID_ORDER_DATE_IDX', [
  'userId',
  'stockId',
  'stockBuyOrder',
  'date',
])
@Index('TB_STAT_STOCK_TIME_SERIES_STOCK_ID_DATE_IDX', ['stockId', 'date'])
export class PgStatStockTimeSeriesEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    primaryKeyConstraintName: 'PK_tb_stat_stock_time_series_id',
  })
  id: number;

  @Column({
    name: 'stockId',
    type: 'int',
    nullable: false,
  })
  stockId: number;

  @Column({
    name: 'stockBuyOrder',
    type: 'int',
    nullable: false,
  })
  stockBuyOrder: number;

  @Column({
    name: 'stockPrice',
    type: 'bigint',
    nullable: false,
  })
  stockPrice: bigint;

  @Column({
    name: 'stockAmount',
    type: 'bigint',
    nullable: false,
  })
  stockAmount: bigint;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
  })
  userId: string | null;

  @ManyToOne(() => PgUserEntity, (user) => user.statStockTimeSeriesDatas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tb_stat_stock_time_series_userId',
  })
  user: Relation<PgUserEntity> | null;

  @Column({
    type: 'timestamp',
    name: 'date',
  })
  date: Date;
}
