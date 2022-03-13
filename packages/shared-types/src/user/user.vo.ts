export type UserIdType = string;

/**
 * 회원가입한 유저
 */
export class UserVo {
  /**
   * PK값
   */
  id: UserIdType;

  /**
   * 해시 처리된 유저 이메일값
   *
   * @type {string}
   * @memberof UserEntity
   */
  email: string;

  /**
   * 유저 닉네임
   *
   * @type {string}
   * @memberof UserEntity
   */
  username: string;

  /**
   * 유저가 잔고량
   *
   * @type {bigint}
   * @memberof UserEntity
   */
  cash: bigint;

  /**
   * 유저가 submit할 수 있도록 허용된 맵 칸.
   * null인 경우, 유저는 어느 칸에도 submit을 할 수 없다.
   * null이 아닌 경우, 유저는 해당 칸에 submit할 수 있다.
   *
   * @type {string}
   * @memberof UserEntity
   */
  submitAllowedMapStop: string | null;

  /**
   * 유저의 '주사위 굴리기' 동작이 현재 금지되었는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
  isUserDiceTossForbidden: boolean;

  /**
   * isUserDiceTossForbidden이 true인 경우에 유저가 주사위를 굴릴 수 있는 시간.
   * isUserDiceTossForbidden이 false인 경우 유저는 무조건 주사위를 굴릴 수 없기 때문에, 이 값에 null이 할당된다.
   *
   * @type {Date}
   * @memberof UserEntity
   */
  canTossDiceAfter: Date | null;

  /**
   * 유저의 3자리 컨트리 코드
   *
   * @type {string}
   * @memberof UserEntity
   */
  countryCode3: string;

  /**
   * 유저가 회원가입을 완료했는지 여부
   *
   * @type {boolean}
   * @memberof UserEntity
   */
  signupCompleted: boolean;
}
