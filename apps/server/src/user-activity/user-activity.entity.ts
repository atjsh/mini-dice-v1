import type { UserIdType } from '@packages/shared-types';
import { IsNotEmpty } from 'class-validator';
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

@Entity({ name: 'tb_user_activity', orderBy: { createdAt: 'DESC' } })
export class UserActivityEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.userActivityEntities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({
    name: 'skillDrawProps',
    type: 'json',
    nullable: true,
  })
  skillDrawProps: Record<string, any>;

  @IsNotEmpty()
  @Column({
    name: 'skillRoute',
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  skillRoute: string;

  @Column({
    name: 'read',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  read: boolean;

  /** 객체가 생성된 날짜 */
  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
    comment: '객체가 생성된 날짜',
  })
  createdAt: Date;
}
