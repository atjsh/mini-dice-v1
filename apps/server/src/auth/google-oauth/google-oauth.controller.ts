import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { GoogleOAuthService } from './google-oauth.service';

@Controller('auth/google-oauth')
export class GoogleOAuthController {
  constructor(
    private googleOAuthService: GoogleOAuthService,
    private configService: ConfigService,
  ) {}

  @Get(':web')
  async authUserWithGoogleOauthCode(
    @Res({ passthrough: true }) response: FastifyReply,
    @Query('code') authCode: string,
    @Param('web') websiteUrlBase64: string,
    @Req() request: FastifyRequest,
  ) {
    const websiteUrl = Buffer.from(websiteUrlBase64, 'base64').toString();

    try {
      const googleOAuthResult =
        await this.googleOAuthService.authUserWithGoogleOauthCode(
          response,
          authCode,
          websiteUrlBase64,
          request.cookies['refreshToken'],
        );

      return response
        .status(301)
        .redirect(
          `${websiteUrl}/${
            googleOAuthResult.isSignupFinished
              ? 'finish-login'
              : 'finish-signup'
          }`,
        );
    } catch (error) {
      console.error(error);

      return response.status(301).redirect(`${websiteUrl}`);
    }
  }
}
