import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ACCESS_TOKEN_APIS } from '../../../common';
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
