import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenController } from './access-token/access-token.controller';
import { AccessTokenService } from './access-token/access-token.service';
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './jwt.guard';
import { LocalJwtService } from './local-jwt.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { JwtStrategy } from './jwt.strategy';
import * as redisStore from 'cache-manager-redis-store';
import { LocalJwtController } from './local-jwt.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
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
