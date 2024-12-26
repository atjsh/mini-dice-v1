import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_user_activity',
})
@Index('TB_USER_ACTIVITY_USER_ID_IDX', ['userId'])
@Index('TB_USER_ACTIVITY_CREATED_AT_IDX', ['createdAt'])
@Index('TB_USER_ACTIVITY_USER_ID_CREATED_AT_IDX', ['userId', 'createdAt'])
export class PgUserActivityEntity {
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

  @Column({
    name: 'skillDrawProps',
    type: 'json',
    nullable: true,
  })
  skillDrawProps: string;

  @Column({
    name: 'skillRoute',
    type: 'varchar',
    length: 255,
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

  @ManyToOne(() => PgUserEntity, (user) => user.userActivityEntities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<PgUserEntity>;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;
}
