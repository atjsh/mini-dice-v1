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

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (user) => user.frontendErrors)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
