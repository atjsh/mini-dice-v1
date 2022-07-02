import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { UserIdType } from '@packages/shared-types';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

const SEARCH_BY_LAND_ID_PAGED_INDEX_NAME = 'land_id_date';

@Entity()
@Index(SEARCH_BY_LAND_ID_PAGED_INDEX_NAME, ['landId', 'date'])
export class UserLandCommentEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'char',
    length: '36',
    nullable: false,
  })
  userId: UserIdType;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  landId: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  comment: string;

  @CreateDateColumn()
  date: Date;
}
