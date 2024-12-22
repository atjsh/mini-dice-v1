import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ENV_KEYS } from '../../config/enviorment-variable-config';
import { AccessTokenController } from './access-token/access-token.controller';
import { AccessTokenService } from './access-token/access-token.service';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalJwtController } from './local-jwt.controller';
import { LocalJwtService } from './local-jwt.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenV2Entity } from './refresh-token/entity/refresh-token-v2.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ENV_KEYS.JWT_SECRET),
      }),
    }),
    TypeOrmModule.forFeature([RefreshTokenV2Entity]),
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
