import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { OAUTH_APIS } from '../../common';
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
    @Res({ passthrough: true }) response: FastifyReply,
    @Query('code') authCode: string,
    @Req() request: FastifyRequest,
  ) {
    try {
      const googleOAuthResult =
        await this.googleOAuthService.authUserWithGoogleOauthCode(
          response,
          authCode,
          request.cookies['refreshToken'],
        );

      return response
        .status(302)
        .redirect(
          `${this.configService.get('FRONT_URL')}/login-success?isNewUser=${
            googleOAuthResult.isNewUser
          }`,
        );
    } catch (error) {
      console.error(error);

      return response
        .status(302)
        .redirect(`${this.configService.get('FRONT_URL')}/login`);
    }
  }
}
