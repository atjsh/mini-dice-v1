import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { v7 } from 'uuid';
import { PgLandEntity } from './pg-land.entity';
import { PgRefreshTokenEntity } from './pg-refresh-token.entity';
import { PgMoneyCollectionParticipantEntity } from './pg-money-collection-participants.entity';
import { PgUserActivityEntity } from './pg-user-activity.entity';
import { PgSkillLogEntity } from './pg-skill-log.entity';

@Entity({
  name: 'tb_user',
})
@Index('TB_USER_IS_TERMINATED_IDX', ['isTerminated'])
@Index('TB_USER_EMAIL_AUTH_PROVIDER_IS_TERMINATED_IDX', [
  'email',
  'authProvider',
  'isTerminated',
])
@Index('TB_USER_EMAIL_AUTH_PROVIDER', ['email', 'authProvider'])
@Index('TB_USER_USER_IDV1', ['userIdv1'])
export class PgUserEntity {
  @PrimaryColumn({
    name: 'userId',
    type: 'uuid',
    primaryKeyConstraintName: 'PK_tb_user_userId',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = v7();
  }

  @Column({
    name: 'userIdv1',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  userIdv1: string | null;

  @Column({
    name: 'plain_email',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  email: string | null;

  @Column({
    name: 'authProvider',
    type: 'varchar',
    nullable: false,
    length: 10,
  })
  authProvider: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'cash',
    type: 'bigint',
    nullable: false,
  })
  cash: string;

  @Column({
    name: 'submitAllowedMapStop',
    type: 'varchar',
    nullable: true,
    default: null,
    length: 80,
  })
  submitAllowedMapStop: string | null;

  @Column({
    name: 'isUserDiceTossForbidden',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isUserDiceTossForbidden: boolean;

  @Column({
    name: 'canTossDiceAfter',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  canTossDiceAfter: Date | null;

  @Column({
    name: 'countryCode3',
    length: 3,
    nullable: false,
    type: 'varchar',
  })
  countryCode3: string;

  @Column({
    name: 'signupCompleted',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  signupCompleted: boolean;

  @Column({
    name: 'isTerminated',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isTerminated: boolean;

  @Column({
    name: 'stockId',
    type: 'int',
    nullable: true,
    default: null,
  })
  stockId: number | null;

  @Column({
    name: 'stockPrice',
    type: 'bigint',
    nullable: false,
    default: 0,
  })
  stockPrice: bigint;

  @Column({
    name: 'stockAmount',
    type: 'bigint',
    nullable: false,
    default: 0,
  })
  stockAmount: bigint;

  @Column({
    name: 'stockCashPurchaseSum',
    type: 'bigint',
    default: null,
    nullable: true,
  })
  stockCashPurchaseSum: bigint | null;

  @Column({
    name: 'canAddLandComment',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  canAddLandComment: boolean;

  @OneToMany(() => PgLandEntity, (land) => land.user)
  lands: Relation<PgLandEntity>[];

  @OneToMany(
    () => PgMoneyCollectionParticipantEntity,
    (moneyCollectionParticipantsEntity) =>
      moneyCollectionParticipantsEntity.user,
  )
  moneyCollectionParticipants: Relation<PgMoneyCollectionParticipantEntity>[];

  @OneToMany(
    () => PgUserActivityEntity,
    (userActivityEntity) => userActivityEntity.user,
  )
  userActivityEntities: PgUserActivityEntity[];

  @OneToMany(() => PgRefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: Relation<PgRefreshTokenEntity>[];

  @OneToMany(() => PgSkillLogEntity, (skillLog) => skillLog.user)
  skillLogs: Relation<PgSkillLogEntity>[];

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
