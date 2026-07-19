import { IsNotEmpty, ValidateNested } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { UserEntity } from '../../user/entity/user.entity';
import type { UserActivityType } from '../types/user-activity.dto';

@Entity({ name: 'tb_skill_log' })
@Index('TB_SKILL_LOG_USER_ID_CREATED_AT_IDX', ['userId', 'date'])
export class SkillLogEntity<
  T extends Record<string, any> | undefined = Record<string, any> | undefined,
> {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
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

  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @ValidateNested({ each: true })
  @IsNotEmpty()
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
  userActivity: UserActivityType | null;

  @Column({
    name: 'skillServiceResult',
    type: 'json',
    nullable: true,
  })
  skillServiceResult: T | null;

  @Column({
    name: 'payload',
    type: 'bytea',
    nullable: true,
  })
  payload: Buffer | null;

  @Column({
    name: 'payloadCodec',
    type: 'smallint',
    nullable: true,
  })
  payloadCodec: number | null;

  @CreateDateColumn({
    name: 'createdAt',
  })
  date: Date;
}
