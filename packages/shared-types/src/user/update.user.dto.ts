import { UserVo } from './user.vo';

export type UpdateUserDto = Partial<Pick<UserVo, 'username' | 'countryCode3'>>;
