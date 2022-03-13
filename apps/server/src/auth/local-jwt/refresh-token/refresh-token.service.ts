import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { v4 as uuid4 } from 'uuid';
import { REFRESH_TOKEN_EXPIRES_IN } from '../constants';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { Response } from 'express';
import { UserIdType } from '@packages/shared-types';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private getCacheKey(tokenValue: string) {
    return `rt:${tokenValue}`;
  }

  async createNewRefreshToken(
    createRefreshTokenDto: CreateRefreshTokenDto,
  ): Promise<RefreshTokenEntity> {
    const tokenValue = uuid4();
    await this.cacheManager.set(
      this.getCacheKey(tokenValue),
      createRefreshTokenDto.userId,
      {
        ttl: 1000 * REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    return {
      value: tokenValue,
      userId: createRefreshTokenDto.userId,
    };
  }

  // Express Response를 사용하여, 유저 cookie에 refreshToken을 설정함
  public setRefreshTokenOnCookie(
    expressResponse: Response,
    refreshTokenEntity: RefreshTokenEntity,
  ) {
    expressResponse.cookie('refreshToken', refreshTokenEntity.value, {
      maxAge: 1000 * REFRESH_TOKEN_EXPIRES_IN,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain: 'localhost',
    });
  }

  async deleteRefreshToken(
    expressResponse: Response,
    refreshTokenValue: string,
  ) {
    expressResponse.clearCookie('refreshToken');
    await this.cacheManager.del(this.getCacheKey(refreshTokenValue));
  }

  async findRefreshToken(
    value: RefreshTokenEntity['value'],
  ): Promise<RefreshTokenEntity> {
    const refreshTokenUserId = await this.cacheManager.get<UserIdType>(
      this.getCacheKey(value),
    );
    if (refreshTokenUserId) {
      return {
        value,
        userId: refreshTokenUserId,
      };
    }

    throw new ForbiddenException(`Refresh Token Not Valid: ${value}`);
  }
}
