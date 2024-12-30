import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { PgUserEntity } from './pg-user.entity';

@Entity({ name: 'tb_skill_log' })
@Index('TB_SKILL_LOG_USER_ID_IDX', ['userId'])
@Index('TB_SKILL_LOG_USER_ID_CREATED_AT_IDX', ['userId', 'createdAt'])
export class PgSkillLogEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    primaryKeyConstraintName: 'PK_tb_skill_log_id',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Column({
    name: 'userId',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => PgUserEntity, (user) => user.skillLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tb_skill_log_userId',
  })
  user: Relation<PgUserEntity>;

  @Column({
    name: 'skillRoute',
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  skillRoute: string;

  @Column({
    name: 'userActivity',
    type: 'json',
    nullable: true,
  })
  userActivity: string;

  @Column({
    name: 'skillServiceResult',
    type: 'json',
    nullable: true,
  })
  skillServiceResult: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;
}
