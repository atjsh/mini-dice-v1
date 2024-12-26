import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { v7 } from 'uuid';
import { REFRESH_TOKEN_EXPIRES_IN_MS } from '../constants';
import type { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshTokenV2Entity } from './entity/refresh-token-v2.entity';
import type { RefreshTokenEntity } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenV2Entity)
    private readonly refreshTokenRepository: Repository<RefreshTokenV2Entity>,
  ) {}

  async createNewRefreshToken(
    createRefreshTokenDto: CreateRefreshTokenDto,
  ): Promise<RefreshTokenEntity> {
    const tokenValue = v7();

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        id: tokenValue,
        userId: createRefreshTokenDto.userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
      }),
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
    await this.refreshTokenRepository.delete(refreshTokenValue);
  }

  async findRefreshToken(
    refreshTokenValue: RefreshTokenEntity['value'],
  ): Promise<RefreshTokenEntity> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        id: refreshTokenValue,
      },
    });

    if (
      refreshToken &&
      refreshToken.userId &&
      refreshToken.expiresAt > new Date()
    ) {
      return {
        value: refreshTokenValue,
        userId: refreshToken.userId,
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
