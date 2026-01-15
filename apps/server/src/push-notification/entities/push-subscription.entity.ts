import type { UserIdType } from '@packages/shared-types';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'tb_push_subscriptions' })
export class PushSubscriptionEntity {
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
  userId: UserIdType;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({
    name: 'endpoint',
    type: 'text',
    nullable: false,
  })
  endpoint: string;

  @Column({
    name: 'pushType',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  pushType: 'declarative' | 'service-worker';

  @Column({
    name: 'p256dhKey',
    type: 'text',
    nullable: true,
  })
  p256dhKey: string | null;

  @Column({
    name: 'authKey',
    type: 'text',
    nullable: true,
  })
  authKey: string | null;

  @Column({
    name: 'userAgent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  @Column({
    name: 'expirationTime',
    type: 'timestamp',
    nullable: true,
  })
  expirationTime: Date | null;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
  })
  updatedAt: Date;
}
