import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'money_collection_participants_entity',
})
export class MySQLMoneyCollectionParticipantsEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'int',
    generated: 'increment',
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
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  userId: string;
}
