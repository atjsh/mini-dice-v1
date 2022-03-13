import { OAUTH_APIS } from '@apps/server/common';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GoogleOAuthService } from './google-oauth.service';

@ApiTags(OAUTH_APIS)
@Controller('auth/google-oauth')
export class GoogleOAuthController {
  constructor(
    private googleOAuthService: GoogleOAuthService,
    private configService: ConfigService,
  ) {}

  @Get('')
  async authUserWithGoogleOauthCode(
    @Res({ passthrough: true }) response: Response,
    @Query('code') authCode: string,
  ) {
    try {
      const googleOAuthResult =
        await this.googleOAuthService.authUserWithGoogleOauthCode(
          response,
          authCode,
        );

      return response.redirect(
        `${this.configService.get('FRONT_URL')}/login-success?isNewUser=${
          googleOAuthResult.isNewUser
        }`,
      );
    } catch (error) {
      console.log(error);

      return response.redirect(`${this.configService.get('FRONT_URL')}/login`);
    }
  }
}
