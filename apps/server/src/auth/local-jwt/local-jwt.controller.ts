import { Controller, Post, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@ApiTags('로그아웃 (delete RefreshToken)')
@Controller('auth/logout')
export class LocalJwtController {
  constructor(private refreshTokenService: RefreshTokenService) {}

  @Post('')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    await this.refreshTokenService.deleteRefreshToken(
      response,
      req.cookies.refreshToken,
    );

    return {
      success: true,
    };
  }
}
