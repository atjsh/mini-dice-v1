import type { UserIdType } from '@packages/shared-types';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'tb_user_preference' })
export class UserPreferenceEntity {
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
    unique: true,
  })
  userId: UserIdType;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({
    name: 'alwaysHideComments',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  alwaysHideComments: boolean;

  @Column({
    name: 'pushNotificationsEnabled',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  pushNotificationsEnabled: boolean;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
