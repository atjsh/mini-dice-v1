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
