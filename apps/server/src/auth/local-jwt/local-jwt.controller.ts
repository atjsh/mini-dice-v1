import { Controller, Post, Res, Req, Get } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Controller('auth/logout')
export class LocalJwtController {
  constructor(private refreshTokenService: RefreshTokenService) {}

  @Post('')
  async logout(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    req.cookies['refreshToken'] &&
      (await this.refreshTokenService.deleteRefreshToken(
        response,
        req.cookies['refreshToken'],
      ));
    return {
      success: true,
    };
  }

  @Get('')
  async logoutGet(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    req.cookies['refreshToken'] &&
      (await this.refreshTokenService.deleteRefreshToken(
        response,
        req.cookies['refreshToken'],
      ));
    return {
      success: true,
    };
  }
}
