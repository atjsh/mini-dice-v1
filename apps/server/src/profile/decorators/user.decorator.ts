import type { ExecutionContext } from '@nestjs/common';
import {
  applyDecorators,
  createParamDecorator,
  UseGuards,
} from '@nestjs/common';
import type { UserJwtDto } from '../../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuthGuard } from '../../auth/local-jwt/jwt.guard';

export const UserJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserJwtDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const JwtAuth = () => applyDecorators(UseGuards(JwtAuthGuard));
