import { applyDecorators } from '@nestjs/common';
import { IsIn } from 'class-validator';

export const IsEnumValue = (enumObject: Record<string, string | number>) =>
  applyDecorators(IsIn(Object.values(enumObject)));
