import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AccessTokenService } from './access-token.service';

@Controller('auth/access-token')
export class AccessTokenController {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  @Get()
  getAccessToken(@Req() request: FastifyRequest) {
    if (request.cookies['refreshToken']) {
      return this.accessTokenService.createNewAccessToken(
        request.cookies['refreshToken'],
      );
    }

    throw new ForbiddenException();
  }
}
