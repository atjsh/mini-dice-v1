import { ApiHideProperty } from '@nestjs/swagger';
import { UserIdType } from '@packages/shared-types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Entity()
export class UserActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'char',
    length: '36',
    nullable: false,
    default: null,
  })
  userId: UserIdType;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.userActivityEntities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({
    type: 'json',
    nullable: true,
  })
  skillDrawProps: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
  })
  skillDrawResult: Record<string, any>;
}
