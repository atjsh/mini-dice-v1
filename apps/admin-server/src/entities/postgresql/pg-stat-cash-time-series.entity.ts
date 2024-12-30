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
  name: 'tb_stat_cash_time_series',
})
@Index('TB_STAT_CASH_TIME_SERIES_USER_ID_DATE_IDX', ['userId', 'date'])
export class PgStatCashTimeSeriesEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    primaryKeyConstraintName: 'PK_tb_stat_cash_time_series_id',
  })
  id: number;

  @Column({
    name: 'cash',
    type: 'bigint',
    nullable: false,
  })
  cash: string;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
  })
  userId: string | null;

  @ManyToOne(() => PgUserEntity, (user) => user.statCashTimeSeriesDatas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tb_stat_cash_time_series_userId',
  })
  user: Relation<PgUserEntity> | null;

  @Column({
    type: 'timestamp',
    name: 'date',
  })
  date: Date;
}
