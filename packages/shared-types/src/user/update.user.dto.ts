import { PartialType, PickType } from '@nestjs/swagger';
import { UserVo } from './user.vo';

export class UpdateUserDto extends PartialType(
  PickType(UserVo, ['username', 'countryCode3']),
) {}
