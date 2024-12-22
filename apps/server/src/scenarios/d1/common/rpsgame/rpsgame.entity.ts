import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'rpsgame_entity' })
export class RpsgameEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: '10',
  })
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  move: string;
}
