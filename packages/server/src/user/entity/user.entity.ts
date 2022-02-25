import {
  countryCode3List,
  EntityWithTimestamps,
  getSequentialPk,
} from '@apps/server/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsIn, MaxLength, MinLength } from 'class-validator';
import * as _ from 'lodash';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

const UserEntityTableName = 'tb_user';

export type UserCashStrType = string;
export type UserIdType = UserEntity['id'];

@Entity({ name: UserEntityTableName })
export class UserEntity extends EntityWithTimestamps {
  /**
   * PK값
   */
  @ApiProperty({ readOnly: true })
  @PrimaryColumn({
    length: 20,
  })
  id: string;

  @BeforeInsert()
  setPk() {
    this.id = getSequentialPk(UserEntityTableName);
  }

  /**
   * 해시 처리된 유저 이메일값
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  hashedEmail: string;

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
  @Exclude()
  @Column('bigint', {
    transformer: {
      to: (entityValue: bigint) => entityValue,
      from: (databaseValue?: string) =>
        _.isNil(databaseValue) ? undefined : BigInt(databaseValue),
    },
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
    length: 10,
    nullable: false,
  })
  countryCode3: string;

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
}

/**
 * 유저의 잔고량을 문자열로 변환함
 * @param user
 * @returns
 */
export function getUserCash(user: UserEntity): UserCashStrType {
  return user.cash.toString();
}

/**
 * 유저 데이터를 JSON으로 변환시킨 데이터 타입.
 * 유저의 잔고량을 문자열로 변환시킨 상태로 데이터가 변환된다.
 */
export type UserEntityJson = Omit<UserEntity, 'cash' | 'setPk'> & {
  cash: string;
};

/**
 * 유저 데이터를 JSON 형태로 변환시킨다.
 * @param user
 * @returns
 */
export function serializeUserToJson(user: UserEntity): UserEntityJson {
  return {
    ...user,
    cash: getUserCash(user),
  };
}
