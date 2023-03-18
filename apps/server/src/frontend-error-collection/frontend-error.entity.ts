import type { UserIdType } from '@packages/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Entity()
export class FrontendErrorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  error: string;

  @Column({
    type: 'char',
    length: '36',
  })
  userId: UserIdType;

  @ManyToOne(() => UserEntity, (user) => user.frontendErrors)
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @CreateDateColumn()
  createdAt: Date;
}
