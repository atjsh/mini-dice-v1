import type { UserIdType } from '@packages/shared-types';
import { IsNotEmpty } from 'class-validator';
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
import { UserEntity } from '../user/entity/user.entity';

const SEARCH_BY_USER_ID_PAGED_INDEX_NAME = 'user_id_date_ua';

@Entity({ name: 'user_activity_entity', orderBy: { createdAt: 'DESC' } })
@Index(SEARCH_BY_USER_ID_PAGED_INDEX_NAME, ['userId', 'createdAt'])
export class UserActivityEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Index()
  @Column({
    type: 'uuid',
    nullable: false,
    default: null,
  })
  userId: UserIdType;

  @ManyToOne(() => UserEntity, (user) => user.userActivityEntities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({
    type: 'json',
    nullable: true,
  })
  skillDrawProps: Record<string, any>;

  @IsNotEmpty()
  @Column({ nullable: false })
  skillRoute: string;

  @Column({ nullable: false, default: false })
  read: boolean;

  /** 객체가 생성된 날짜 */
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;
}
