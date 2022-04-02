import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UserRepository } from '../../user/user.repository';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { OauthAbstractService } from '../oauth-common/oauth.abstract.service';
import { GoogleApiService } from './google-api.service';

@Injectable()
export class GoogleOAuthService extends OauthAbstractService {
  constructor(
    readonly userRepository: UserRepository,
    readonly refreshTokenService: RefreshTokenService,
    private readonly googleApiService: GoogleApiService,
  ) {
    super(userRepository, refreshTokenService);
  }

  async authUserWithGoogleOauthCode(
    expressResponse: FastifyReply,
    authCode: string,
    websiteUrl: string,
    alreadyExistedRefreshToken?: string,
  ) {
    const { email } = await this.googleApiService.getGoogleUser(
      authCode,
      websiteUrl,
    );

    return await this.authUserWithOauthProvider(
      'google',
      email,
      expressResponse,
      alreadyExistedRefreshToken,
    );
  }
}
