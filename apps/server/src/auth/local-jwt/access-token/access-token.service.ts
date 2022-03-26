import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN } from '../constants';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserJwtDto } from './dto/user-jwt.dto';
export type AccessTokenType = string;

@Injectable()
export class AccessTokenService {
  constructor(
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
  ) {}

  async createNewAccessToken(refreshToken: string): Promise<AccessTokenType> {
    const refreshTokenEntity = await this.refreshTokenService.findRefreshToken(
      refreshToken,
    );

    const payload: UserJwtDto = {
      userId: refreshTokenEntity.userId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }
}
