import { Controller, Post, Res, Req, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@ApiTags('로그아웃 (delete RefreshToken)')
@Controller('auth/logout')
export class LocalJwtController {
  constructor(private refreshTokenService: RefreshTokenService) {}

  async revokeRefreshToken(
    response: FastifyReply,
    req: FastifyRequest,
    res: FastifyReply,
  ) {
    await this.refreshTokenService.deleteRefreshToken(
      response,
      req.cookies.refreshToken,
    );

    res.clearCookie('refreshToken', { path: '/' });

    return {
      success: true,
    };
  }

  @Post('')
  async logout(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    return this.revokeRefreshToken(response, req, res);
  }

  @Get('')
  async logoutGet(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    return this.revokeRefreshToken(response, req, res);
  }
}
