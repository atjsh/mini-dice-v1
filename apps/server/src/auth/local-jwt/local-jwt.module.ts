import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import { AccessTokenController } from './access-token/access-token.controller';
import { AccessTokenService } from './access-token/access-token.service';
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalJwtController } from './local-jwt.controller';
import { LocalJwtService } from './local-jwt.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: +configService.get<number>('REDIS_PORT')!,
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
