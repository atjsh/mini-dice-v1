import { applyDecorators } from '@nestjs/common';
import { IsIn } from 'class-validator';

export const IsEnumValue = (enumObject: any) =>
  applyDecorators(IsIn(Object.values(enumObject)));
