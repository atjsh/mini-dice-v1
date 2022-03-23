import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { countryCode3List, CountryCode3Type } from '@packages/shared-types';
import { Transform, TransformationType } from 'class-transformer';
import { IsIn, MaxLength, MinLength } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityWithTimestamps, getSequentialPk } from '../../common';
import { LandEntity } from '../../scenarios/d1/common/land/entity/land.entity';

const UserEntityTableName = 'tb_user';

export type UserCashStrType = string;

@Entity({ name: UserEntityTableName })
export class UserEntity {
  /**
   * PK값
   */
  @ApiProperty({ readOnly: true })
  @PrimaryColumn({
    length: 20,
    name: 'userId',
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = getSequentialPk(UserEntityTableName);
  }

  /**
   * 유저 이메일값
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
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
  @MaxLength(20)
  @MinLength(2)
  @Column({
    nullable: false,
  })
  username: string;

  /**
   * 유저가 잔고량
   *
   * @type {bigint}
   * @memberof UserEntity
   */
  @Transform(({ type, value }) =>
    type == TransformationType.CLASS_TO_PLAIN ? String(value) : BigInt(value),
  )
  @Column('bigint')
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
    nullable: true,
    default: null,
    type: 'varchar',
    length: 40,
  })
  submitAllowedMapStop: string | null;

  /**
   * 유저의 '주사위 굴리기' 동작이 현재 금지되었는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
  @Column({
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
  @IsIn(countryCode3List)
  @Column({
    length: 3,
    nullable: false,
  })
  countryCode3: CountryCode3Type;

  /**
   * 유저가 회원가입을 완료했는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
  @Column({
    nullable: false,
    default: false,
  })
  signupCompleted: boolean;

  @Column({
    default: false,
  })
  isTerminated: boolean;

  @ApiProperty({ readOnly: true })
  @OneToMany(() => LandEntity, (land) => land.user)
  lands: LandEntity;

  /** 객체가 생성된 날짜 */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({ type: 'timestamp', comment: '객체가 생성된 날짜' })
  createdAt: Date;

  /** 객체가 업데이트된 날짜 */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({ type: 'timestamp', comment: '객체가 업데이트된 날짜' })
  updatedAt: Date;
}

/**
 * 유저 데이터를 JSON으로 변환시킨 데이터 타입.
 * 유저의 잔고량을 문자열로 변환시킨 상태로 데이터가 변환된다.
 */
export type UserEntityJson = Omit<UserEntity, 'cash' | 'setPk'> & {
  cash: string;
};

/**
 * 유저 데이터를 JSON 형태로 변환시킨다. 이 때, 유저의 잔고량을 string으로 변환한다.
 * @param user
 * @returns
 */
export function serializeUserToJson(user: UserEntity): UserEntityJson {
  return {
    ...user,
    cash: user.cash.toString(),
  };
}

export function isUserThrowingDiceTossAllowedOrThrow(user: UserEntity) {
  if (
    user.canTossDiceAfter != null &&
    user.isUserDiceTossForbidden == false &&
    user.canTossDiceAfter < new Date()
  ) {
    return true;
  }

  throw new ForbiddenException(`user dice toss forbidden; ${user.id}`);
}
