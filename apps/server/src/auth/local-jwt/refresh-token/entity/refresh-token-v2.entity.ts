import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../../../user/entity/user.entity';

@Entity({
  name: 'refresh_token_entity',
})
export class RefreshTokenV2Entity {
  @PrimaryColumn({
    type: 'char',
    length: 36,
  })
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;
}
