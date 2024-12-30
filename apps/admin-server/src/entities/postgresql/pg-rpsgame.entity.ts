import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_rpsgame' })
export class PgRpsgameEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: '10',
    primaryKeyConstraintName: 'PK_tb_rpsgame_id',
  })
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  move: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
