import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'money_collection_entity' })
export class MoneyCollectionEntity {
  @PrimaryColumn()
  id: number;

  @Column('mediumtext', {
    nullable: true,
  })
  usernames: string | null;
}
