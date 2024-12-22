import type { UserIdType } from '@packages/shared-types';
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

const SEARCH_BY_USER_ID_PAGED_INDEX_NAME = 'user_id_date_sl';

@Entity({ name: 'skill_log_entity' })
@Index(SEARCH_BY_USER_ID_PAGED_INDEX_NAME, ['userId', 'date'])
export class SkillLogEntity<
  T extends Record<string, any> | undefined = Record<string, any> | undefined,
> {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Column({
    type: 'uuid',
    nullable: false,
    default: null,
  })
  userId: UserIdType;

  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Column({})
  skillRoute: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  userActivity: UserActivityType;

  @Column({
    type: 'json',
    nullable: true,
  })
  skillServiceResult: T;

  @CreateDateColumn()
  date: Date;
}
