import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../../../../user/entity/user.entity';

@Entity({ name: 'tb_money_collection_participant' })
export class MoneyCollectionParticipantsEntity {
  @PrimaryColumn({
    generated: 'increment',
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'moneyCollectionId',
    type: 'int',
    nullable: false,
  })
  moneyCollectionId: number;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
  })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.moneyCollectionParticipants, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity | null>;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;
}
