import { UserService } from '@apps/server/user/user.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { GoogleUser } from './class/google-user.class';

export class GoogleOAuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 구글로부터 유저 정보를 조회해옴.
   * @param accessToken
   * @returns
   */
  private async getGoogleUserFromGoogleAPI(
    accessToken: string,
  ): Promise<GoogleUser> {
    const { data: userInfo } = await lastValueFrom(
      this.httpService.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      ),
    );

    return plainToClass(GoogleUser, userInfo);
  }
}
