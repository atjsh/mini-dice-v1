import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'user_activity_entity',
})
export class MySQLUserActivityEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 36,
  })
  id: string;

  @Column({
    name: 'userId',
    type: 'varchar',
    length: 36,
  })
  userId: string;

  @Column({
    name: 'skillDrawProps',
    type: 'json',
    nullable: true,
  })
  skillDrawProps: string | null;

  @Column({
    name: 'skillRoute',
    type: 'varchar',
    length: 255,
  })
  skillRoute: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({
    name: 'read',
    type: 'boolean',
  })
  read: boolean;
}
