import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../../../../user/entity/user.entity';

@Entity({
  name: 'tb_land',
})
export class LandEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.lands, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity> | null;

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

  get isLandExpired(): boolean {
    if (this.expiresAt) {
      return this.expiresAt <= new Date();
    }
    return true;
  }
}
