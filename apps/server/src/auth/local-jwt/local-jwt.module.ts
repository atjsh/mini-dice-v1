import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import { AccessTokenController } from './access-token/access-token.controller';
import { AccessTokenService } from './access-token/access-token.service';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalJwtController } from './local-jwt.controller';
import { LocalJwtService } from './local-jwt.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ENV_KEYS } from '../../config/enviorment-variable-config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ENV_KEYS.JWT_SECRET),
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow(ENV_KEYS.REDIS_HOST),
        port: +configService.getOrThrow<number>(ENV_KEYS.REDIS_PORT),
        auth_pass: configService.get(ENV_KEYS.REDIS_PASSWORD),
      }),
    }),
  ],
  controllers: [AccessTokenController, LocalJwtController],
  providers: [
    LocalJwtService,
    RefreshTokenService,
    AccessTokenService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [LocalJwtService, RefreshTokenService],
})
export class LocalJwtModule {}
