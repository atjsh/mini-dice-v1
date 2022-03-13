import { UserModule } from '@apps/server/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalJwtModule } from '../local-jwt/local-jwt.module';
import { GoogleApiService } from './google-api.service';
import { GoogleOAuthController } from './google-oauth.controller';
import { GoogleOAuthService } from './google-oauth.service';

@Module({
  imports: [HttpModule, UserModule, LocalJwtModule, ConfigModule],
  providers: [GoogleOAuthService, GoogleApiService],
  controllers: [GoogleOAuthController],
})
export class GoogleOAuthModule {}
