import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserIdType } from '@packages/shared-types';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Entity({ orderBy: { createdAt: 'DESC' } })
export class UserActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
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
  @Column({ nullable: false })
  skillRoute: string;

  @Column({ nullable: false, default: false })
  read: boolean;

  /** 객체가 생성된 날짜 */
  @Index()
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;
}
