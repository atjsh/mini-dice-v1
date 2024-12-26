import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_land',
})
@Index('TB_LAND_USER_ID_IDX', ['userId'])
export class PgLandEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'landName',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  landName: string;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
  })
  userId: string | null;

  @ManyToOne(() => PgUserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<PgUserEntity> | null;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  expiresAt: Date | null;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
