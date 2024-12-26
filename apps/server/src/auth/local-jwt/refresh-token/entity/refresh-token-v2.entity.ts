import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../../../user/entity/user.entity';

@Entity({
  name: 'tb_refresh_token',
})
export class RefreshTokenV2Entity {
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

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;

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
