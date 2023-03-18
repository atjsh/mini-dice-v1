import type { UserIdType } from '@packages/shared-types';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import type { UserActivityType } from '../types/user-activity.dto';

const SEARCH_BY_USER_ID_PAGED_INDEX_NAME = 'user_id_date';

@Entity()
@Index(SEARCH_BY_USER_ID_PAGED_INDEX_NAME, ['userId', 'date'])
export class SkillLogEntity<
  T extends Record<string, any> | undefined = Record<string, any> | undefined,
> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'char',
    length: '36',
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
