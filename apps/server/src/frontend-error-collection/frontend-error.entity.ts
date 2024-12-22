import type { UserIdType } from '@packages/shared-types';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { UserEntity } from '../user/entity/user.entity';

@Entity({ name: 'frontend_error_entity' })
export class FrontendErrorEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Column({
    type: 'text',
  })
  error: string;

  @Column({
    type: 'uuid',
  })
  userId: UserIdType;

  @ManyToOne(() => UserEntity, (user) => user.frontendErrors)
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @CreateDateColumn()
  createdAt: Date;
}
