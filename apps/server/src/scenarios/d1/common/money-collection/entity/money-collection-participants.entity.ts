import type { UserIdType } from '@packages/shared-types';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/entity/user.entity';

@Entity()
export class MoneyCollectionParticipantsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  moneyCollectionId: number;

  @Column({
    type: 'char',
    length: '36',
    nullable: true,
    default: null,
  })
  userId: UserIdType | null;

  @ManyToOne(() => UserEntity, (user) => user.moneyCollectionParticipants, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity | null;
}
