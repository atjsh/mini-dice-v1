import { UserIdType } from '@packages/shared-types';
import { UserEntity } from 'apps/server/src/user/entity/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
