import { UserRepository } from '@apps/server/user/user.repository';
import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
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
    alreadyExistedRefreshToken?: string,
  ): Promise<{ isNewUser: boolean }> {
    const { email } = await this.googleApiService.getGoogleUser(authCode);

    return await this.authUserWithOauthProvider(
      'google',
      email,
      expressResponse,
      alreadyExistedRefreshToken,
    );
  }
}
