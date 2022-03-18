import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { stringify } from 'qs';
import { GoogleUser } from './class/google-user.class';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getGoogleUserFromGoogleAPI(accessToken: string): Promise<GoogleUser> {
    const { data: userInfo } = await lastValueFrom(
      this.httpService.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      ),
    );

    console.log(userInfo);

    return plainToClass(GoogleUser, userInfo);
  }

  async getAccessTokenFromGoogle(authCode: string): Promise<string> {
    const { data } = await lastValueFrom(
      this.httpService.post(
        'https://oauth2.googleapis.com/token',
        stringify({
          code: authCode,
          client_id: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
          client_secret: this.configService.get('GOOGLE_OAUTH_CLILENT_SECRET'),
          redirect_uri: this.configService.get('GOOGLE_OAUTH_REDIRECT_URI'),
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          validateStatus: () => true,
        },
      ),
    );

    return data.access_token;
  }

  async getGoogleUser(authCode: string): Promise<GoogleUser> {
    const accessToken = await this.getAccessTokenFromGoogle(authCode);

    return await this.getGoogleUserFromGoogleAPI(accessToken);
  }
}
