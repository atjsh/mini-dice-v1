import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_money_collection_participant',
})
@Index('TB_MONEY_COLLECTION_PARTICIPANT_USER_ID_IDX', ['userId'])
@Index('TB_MONEY_COLLECTION_PARTICIPANT_MONEY_COLLECTION_ID_IDX', [
  'moneyCollectionId',
])
export class PgMoneyCollectionParticipantEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'int',
    primaryKeyConstraintName: 'PK_tb_money_collection_participant_id',
  })
  id: number;

  @Column({
    name: 'moneyCollectionId',
    type: 'int',
    nullable: false,
  })
  moneyCollectionId: number;

  @Column({
    name: 'userId',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => PgUserEntity, (user) => user.moneyCollectionParticipants, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tb_money_collection_participant_userId',
  })
  user: Relation<PgUserEntity>;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;
}
