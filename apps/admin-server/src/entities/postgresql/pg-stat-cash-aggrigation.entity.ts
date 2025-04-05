import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PgSkillLogEntity } from './pg-skill-log.entity';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_stat_cash_aggrigation',
})
export class PgStatCashAggrigationEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    primaryKeyConstraintName: 'PK_tb_stat_cash_aggrigation_id',
  })
  id: number;

  @Column({
    name: 'lastSkillLogId',
    type: 'uuid',
    nullable: false,
  })
  lastSkillLogId: string;

  @OneToOne(() => PgSkillLogEntity, (skillLog) => skillLog.statCashAggrigation)
  @JoinColumn({ name: 'lastSkillLogId' })
  lastSkillLog: Relation<PgSkillLogEntity>;

  @Column({
    name: 'userId',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @OneToOne(() => PgUserEntity, (user) => user.statCashAggrigation)
  @JoinColumn({ name: 'userId' })
  user: Relation<PgUserEntity>;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
