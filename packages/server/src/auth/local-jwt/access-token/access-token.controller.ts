import { ACCESS_TOKEN_APIS } from '@apps/server/common';
import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenService } from './access-token.service';

@ApiTags(ACCESS_TOKEN_APIS)
@Controller('auth/access-token')
export class AccessTokenController {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  @Get()
  getAccessToken(@Req() request: Request) {
    if (request.cookies['refreshToken']) {
      return this.accessTokenService.createNewAccessToken(
        request.cookies['refreshToken'],
      );
    }

    throw new ForbiddenException('refreshToken not found.');
  }
}
