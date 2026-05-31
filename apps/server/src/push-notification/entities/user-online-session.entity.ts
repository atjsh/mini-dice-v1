import type { UserIdType } from '@packages/shared-types';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'tb_user_online_sessions' })
export class UserOnlineSessionEntity {
  @PrimaryColumn({
    name: 'userId',
    type: 'uuid',
  })
  userId: UserIdType;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({
    name: 'lastHeartbeat',
    type: 'timestamp',
    nullable: false,
  })
  lastHeartbeat: Date;

  @Column({
    name: 'sessionId',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  sessionId: string | null;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
  })
  updatedAt: Date;
}
