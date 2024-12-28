import type { CountryCode3Type, StockIdType } from '@packages/shared-types';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { v7 } from 'uuid';
import { RefreshTokenV2Entity } from '../../auth/local-jwt/refresh-token/entity/refresh-token-v2.entity';
import { LandEntity } from '../../scenarios/d1/common/land/entity/land.entity';
import { MoneyCollectionParticipantsEntity } from '../../scenarios/d1/common/money-collection/entity/money-collection-participants.entity';
import { UserActivityEntity } from '../../user-activity/user-activity.entity';

const UserEntityTableName = 'tb_user';

export type UserCashStrType = string;

@Entity({ name: UserEntityTableName })
export class UserEntity {
  /**
   * PK값
   */
  @PrimaryColumn({
    name: 'userId',
    type: 'uuid',
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

  /**
   * 유저 이메일값
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    name: 'plain_email',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  email: string;

  /**
   * 유저 인증 크리덴셜 제공자 ('google', 'apple', 'hcaptcha')
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    name: 'authProvider',
    type: 'varchar',
    nullable: false,
    length: 10,
  })
  authProvider: string;

  /**
   * 유저 닉네임
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  /**
   * 유저가 잔고량
   *
   * @type {bigint}
   * @memberof UserEntity
   */
  @Column({
    name: 'cash',
    type: 'bigint',
    nullable: false,
  })
  cash: bigint;

  /**
   * 유저가 submit할 수 있도록 허용된 맵 칸.
   * null인 경우, 유저는 어느 칸에도 submit을 할 수 없다.
   * null이 아닌 경우, 유저는 해당 칸에 submit할 수 있다.
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    name: 'submitAllowedMapStop',
    type: 'varchar',
    nullable: true,
    default: null,
    length: 80,
  })
  submitAllowedMapStop: string | null;

  /**
   * 유저의 '주사위 굴리기' 동작이 현재 금지되었는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
  @Column({
    name: 'isUserDiceTossForbidden',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isUserDiceTossForbidden: boolean;

  /**
   * isUserDiceTossForbidden이 true인 경우에 유저가 주사위를 굴릴 수 있는 시간.
   * isUserDiceTossForbidden이 false인 경우 유저는 무조건 주사위를 굴릴 수 없기 때문에, 이 값에 null이 할당된다.
   *
   * @type {Date}
   * @memberof UserEntity
   */
  @Column({
    name: 'canTossDiceAfter',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  canTossDiceAfter: Date | null;

  /**
   * 유저의 3자리 컨트리 코드
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    name: 'countryCode3',
    length: 3,
    nullable: false,
    type: 'varchar',
  })
  countryCode3: CountryCode3Type;

  /**
   * 유저가 회원가입을 완료했는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
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
  stockId: StockIdType | null;

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

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;

  @OneToMany(() => LandEntity, (land) => land.user)
  lands: Relation<LandEntity>[];

  @OneToMany(
    () => MoneyCollectionParticipantsEntity,
    (moneyCollectionParticipantsEntity) =>
      moneyCollectionParticipantsEntity.user,
  )
  moneyCollectionParticipants: Relation<MoneyCollectionParticipantsEntity>[];

  @OneToMany(
    () => UserActivityEntity,
    (userActivityEntity) => userActivityEntity.user,
  )
  userActivityEntities: UserActivityEntity[];

  @OneToMany(() => RefreshTokenV2Entity, (refreshToken) => refreshToken.user)
  refreshTokens: Relation<RefreshTokenV2Entity>[];
}
