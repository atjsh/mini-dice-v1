import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'land_entity',
})
export class MySQLLandEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'landName',
    type: 'varchar',
    length: 255,
  })
  landName: string;

  @Column({
    name: 'userId',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'expiresAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date;
}
