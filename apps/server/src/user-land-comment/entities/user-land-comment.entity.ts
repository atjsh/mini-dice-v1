import type { UserIdType } from '@packages/shared-types';
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
import { UserEntity } from '../../user/entity/user.entity';

const SEARCH_BY_LAND_ID_PAGED_INDEX_NAME = 'land_id_date';

@Entity({ name: 'user_land_comment_entity' })
@Index(SEARCH_BY_LAND_ID_PAGED_INDEX_NAME, ['landId', 'date'])
export class UserLandCommentEntity {
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
  userId: UserIdType;

  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;

  @Column({ nullable: false })
  landId: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  comment: string;

  @CreateDateColumn()
  date: Date;
}
