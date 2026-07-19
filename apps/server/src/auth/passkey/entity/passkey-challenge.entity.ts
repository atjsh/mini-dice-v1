import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { UserEntity } from '../../../user/entity/user.entity';

export const passkeyChallengeTypes = [
  'registration',
  'authentication',
] as const;

export type PasskeyChallengeType = (typeof passkeyChallengeTypes)[number];

@Entity({ name: 'tb_passkey_challenge' })
@Index('idx_passkey_challenge_expiresAt', ['expiresAt'])
@Check(
  'chk_passkey_challenge_type',
  `"type" IN ('registration', 'authentication')`,
)
@Check(
  'chk_passkey_challenge_user_binding',
  `("type" = 'registration' AND "userId" IS NOT NULL)
    OR ("type" = 'authentication' AND "userId" IS NULL)`,
)
export class PasskeyChallengeEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 43,
  })
  digest: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  type: PasskeyChallengeType;

  @Column({
    name: 'userId',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity> | null;

  @Column({
    name: 'expiresAt',
    type: 'timestamp',
  })
  expiresAt: Date;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
  })
  createdAt: Date;
}
