import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { PgUserEntity } from './pg-user.entity';

@Entity({
  name: 'tb_refresh_token',
})
export class PgRefreshTokenEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    primaryKeyConstraintName: 'PK_tb_refresh_token_id',
  })
  id: string;

  @Column({
    name: 'userId',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => PgUserEntity, (user) => user.refreshTokens)
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tb_refresh_token_userId',
  })
  user: PgUserEntity;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @Column({
    name: 'expiresAt',
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;
}
