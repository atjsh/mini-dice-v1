import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { ENV_KEYS } from '../config/enviorment-variable-config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow(ENV_KEYS.REDIS_HOST),
        port: configService.getOrThrow(ENV_KEYS.REDIS_PORT),
        auth_pass: configService.get(ENV_KEYS.REDIS_PASSWORD),
        ttl: 60 * 60 * 24,
      }),
    }),
  ],

  exports: [CacheModule],
})
export class CacheProxyModule {}
