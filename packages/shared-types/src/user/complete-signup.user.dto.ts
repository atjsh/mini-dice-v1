import { PickType } from '@nestjs/swagger';
import { UserVo } from './user.vo';

/**
 * 유저의 회원가입을 완료시킬 때 제출해야 하는 정보
 */
export class CompleteSignupUserDto extends PickType(UserVo, [
  'id',
  'countryCode3',
  'username',
]) {}
