import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { OauthAbstractService } from '../oauth-common/oauth.abstract.service';
import { GoogleApiService } from './google-api.service';

@Injectable()
export class GoogleOAuthService extends OauthAbstractService {
  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
    readonly userService: UserService,
    readonly refreshTokenService: RefreshTokenService,
    private readonly googleApiService: GoogleApiService,
  ) {
    super(userRepository, userService, refreshTokenService);
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
