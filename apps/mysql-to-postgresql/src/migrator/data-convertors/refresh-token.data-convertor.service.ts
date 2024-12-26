import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { PgRefreshTokenEntity } from '../../entities/postgresql/pg-refresh-token.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';
import { v7 } from 'uuid';
import { PgUserEntity } from '../../entities/postgresql/pg-user.entity';

@Injectable()
export class RefreshTokenDataConvertorService {
  private readonly redisRefreshTokenRepository: Redis;

  constructor(
    @InjectRepository(PgUserEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserRepository: Repository<PgUserEntity>,

    @InjectRepository(PgRefreshTokenEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgRefreshTokenRepository: Repository<PgRefreshTokenEntity>,

    redisService: RedisService,
  ) {
    this.redisRefreshTokenRepository = redisService.getOrThrow();
  }

  public async convertRefreshTokens(convertedUsersMap: ConvertedUsersMap) {
    const redisRefreshTokens = await this.redisRefreshTokenRepository.keys(
      'rt:*',
    );

    const redisRefreshTokenValues: Record<string, string> = {};

    for (const redisRefreshToken of redisRefreshTokens) {
      const redisRefreshTokenValue = await this.redisRefreshTokenRepository.get(
        redisRefreshToken,
      );

      const redisRefreshTokenParsed = JSON.parse(redisRefreshTokenValue);
      redisRefreshTokenValues[redisRefreshToken.substring(3)] =
        redisRefreshTokenParsed;
    }

    const pgRefreshTokens = [];

    for (const redisRefreshTokenParsed of Object.keys(
      redisRefreshTokenValues,
    )) {
      const pgRefreshToken = new PgRefreshTokenEntity();
      pgRefreshToken.id = redisRefreshTokenParsed;
      pgRefreshToken.userId =
        convertedUsersMap[redisRefreshTokenValues[redisRefreshTokenParsed]];
      if (!pgRefreshToken.userId) {
        // 없는 유저는 토큰도 삭제
        continue;
      }

      pgRefreshToken.createdAt = new Date();
      pgRefreshToken.expiresAt = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 365,
      );

      pgRefreshTokens.push(pgRefreshToken);
    }

    await this.pgRefreshTokenRepository.save(pgRefreshTokens, {
      transaction: false,
    });
  }
}
