import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { ACCESS_TOKEN_APIS } from '../../../common';
import { AccessTokenService } from './access-token.service';

@ApiTags(ACCESS_TOKEN_APIS)
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
