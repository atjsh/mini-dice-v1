import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { UserIdType } from '@packages/shared-types';
import type { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import type { FastifyReply } from 'fastify';
import { REFRESH_TOKEN_EXPIRES_IN_MS } from '../constants';
import type { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import type { RefreshTokenEntity } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private getCacheKey(tokenValue: string) {
    return `rt:${tokenValue}`;
  }

  async createNewRefreshToken(
    createRefreshTokenDto: CreateRefreshTokenDto,
  ): Promise<RefreshTokenEntity> {
    const tokenValue = randomUUID();
    await this.cacheManager.set(
      this.getCacheKey(tokenValue),
      createRefreshTokenDto.userId,
      1000 * REFRESH_TOKEN_EXPIRES_IN_MS,
    );

    return {
      value: tokenValue,
      userId: createRefreshTokenDto.userId,
    };
  }

  // Express Response를 사용하여, 유저 cookie에 refreshToken을 설정함
  public setRefreshTokenOnCookie(
    expressResponse: FastifyReply,
    refreshTokenEntity: RefreshTokenEntity,
  ) {
    expressResponse.cookie('refreshToken', refreshTokenEntity.value, {
      maxAge: REFRESH_TOKEN_EXPIRES_IN_MS,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      // domain: 'localhost',
    });
  }

  async deleteRefreshToken(response: FastifyReply, refreshTokenValue: string) {
    response.clearCookie('refreshToken', { path: '/' });
    await this.cacheManager.del(this.getCacheKey(refreshTokenValue));
  }

  async findRefreshToken(
    refreshTokenValue: RefreshTokenEntity['value'],
  ): Promise<RefreshTokenEntity> {
    const refreshTokenUserId = await this.cacheManager.get<UserIdType>(
      this.getCacheKey(refreshTokenValue),
    );
    if (refreshTokenUserId) {
      return {
        value: refreshTokenValue,
        userId: refreshTokenUserId,
      };
    }

    throw new ForbiddenException(
      `Refresh Token Not Valid: ${refreshTokenValue}`,
    );
  }

  /**
   * refreshToken을 찾는다.
   * 실패한 경우, 1. 쿠키에 할당된 refreshToken을 삭제한다. 2. 예외를 던진다.
   * 성공한 경우, refreshToken을 반환한다.
   * @param response
   * @param refreshTokenValue
   * @returns
   */
  async findRefreshTokenOrRevokeAndThrow(
    response: FastifyReply,
    refreshTokenValue: string,
  ): Promise<RefreshTokenEntity> {
    try {
      return await this.findRefreshToken(refreshTokenValue);
    } catch (error) {
      await this.deleteRefreshToken(response, refreshTokenValue);
      throw error;
    }
  }
}
