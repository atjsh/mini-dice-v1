import type { UpdateUserDto } from '@packages/shared-types';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto implements UpdateUserDto {
  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username?: string;

  countryCode3?: UpdateUserDto['countryCode3'];
}
