import {
  Entity,
  PrimaryColumn,
  BeforeInsert,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { v7 } from 'uuid';
import { PgUserEntity } from './pg-user.entity';

@Entity({ name: 'tb_user_land_comment' })
@Index('TB_USER_LAND_COMMENT_USER_ID_IDX', ['userId'])
@Index('TB_USER_LAND_COMMENT_LAND_ID_IDX', ['landId'])
export class PgUserLandCommentEntity {
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
  })
  userId: string;

  @ManyToOne(() => PgUserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<PgUserEntity>;

  @Column({
    name: 'landId',
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  landId: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  comment: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
