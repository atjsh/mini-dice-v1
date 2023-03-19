import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { ENV_KEYS } from '../config/enviorment-variable-config';
import { parseNullString } from '../common';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.getOrThrow(ENV_KEYS.REDIS_HOST));
        console.log(configService.getOrThrow(ENV_KEYS.REDIS_PORT));
        console.log(configService.getOrThrow(ENV_KEYS.REDIS_PASSWORD));

        return {
          store: redisStore,
          host: configService.getOrThrow(ENV_KEYS.REDIS_HOST),
          port: configService.getOrThrow(ENV_KEYS.REDIS_PORT),
          auth_pass: parseNullString(
            configService.getOrThrow(ENV_KEYS.REDIS_PASSWORD),
          ),
          ttl: 60 * 60 * 24,
        };
      },
    }),
  ],

  exports: [CacheModule],
})
export class CacheProxyModule {}
