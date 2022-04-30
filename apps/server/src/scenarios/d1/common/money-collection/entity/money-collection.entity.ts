import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MoneyCollectionEntity {
  @PrimaryColumn()
  id: number;

  @Column('mediumtext', {
    nullable: true,
  })
  usernames: string | null;
}
