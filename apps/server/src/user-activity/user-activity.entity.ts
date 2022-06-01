import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserIdType } from '@packages/shared-types';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
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

  @IsNotEmpty()
  @Column({})
  skillRoute: string;

  /** 객체가 생성된 날짜 */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;
}
