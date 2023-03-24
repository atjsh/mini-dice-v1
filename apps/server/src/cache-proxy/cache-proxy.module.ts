import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { parseNullString } from '../common';
import { ENV_KEYS } from '../config/enviorment-variable-config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          url: `redis://${configService.getOrThrow(
            ENV_KEYS.REDIS_HOST,
          )}:${configService.getOrThrow(ENV_KEYS.REDIS_PORT)}`,
          password:
            parseNullString(
              configService.getOrThrow(ENV_KEYS.REDIS_PASSWORD),
            ) ?? undefined,

          ttl: 60 * 60 * 24,
        };
      },
    }),
  ],

  exports: [CacheModule],
})
export class CacheProxyModule {}
