import { UserJwtDto } from '@apps/server/auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuthGuard } from '@apps/server/auth/local-jwt/jwt.guard';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const UserJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserJwtDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const JwtAuth = () =>
  applyDecorators(ApiBearerAuth('JWT-auth'), UseGuards(JwtAuthGuard));
