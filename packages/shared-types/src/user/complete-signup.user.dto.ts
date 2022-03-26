import { UserVo } from './user.vo';

/**
 * 유저의 회원가입을 완료시킬 때 제출해야 하는 정보
 */
export type CompleteSignupUserDto = Pick<UserVo, 'countryCode3' | 'username'>;
