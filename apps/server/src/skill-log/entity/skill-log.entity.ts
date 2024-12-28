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
import { UserEntity } from '../../user/entity/user.entity';
import type { UserActivityType } from '../types/user-activity.dto';

@Entity({ name: 'tb_skill_log' })
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
  userActivity: UserActivityType;

  @Column({
    name: 'skillServiceResult',
    type: 'json',
    nullable: true,
  })
  skillServiceResult: T;

  @CreateDateColumn({
    name: 'createdAt',
  })
  date: Date;
}
