import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';
import { GoogleUser } from './class/google-user.class';
import { ENV_KEYS } from '../../config/enviorment-variable-config';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getGoogleErrorMessage(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (typeof value.error_description === 'string') {
    return value.error_description;
  }

  if (typeof value.error === 'string') {
    return value.error;
  }

  if (isRecord(value.error) && typeof value.error.message === 'string') {
    return value.error.message;
  }

  return undefined;
}

function assertSuccessfulGoogleResponse(
  operation: string,
  status: number,
  data: unknown,
): void {
  const errorMessage = getGoogleErrorMessage(data);
  if (status >= 200 && status < 300 && errorMessage === undefined) {
    return;
  }

  const detail = errorMessage ? `: ${errorMessage}` : '';
  throw new Error(`Google ${operation} failed with HTTP ${status}${detail}`);
}

function parseGoogleUser(value: unknown): GoogleUser {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    typeof value.email !== 'string' ||
    value.email.length === 0 ||
    typeof value.picture !== 'string' ||
    typeof value.verified_email !== 'boolean'
  ) {
    throw new Error('Google user info response is invalid');
  }

  return plainToClass(GoogleUser, value);
}

function parseAccessToken(value: unknown): string {
  if (
    !isRecord(value) ||
    typeof value.access_token !== 'string' ||
    value.access_token.length === 0
  ) {
    throw new Error('Google token response is invalid');
  }

  return value.access_token;
}

@Injectable()
export class GoogleApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getGoogleUserFromGoogleAPI(accessToken: string): Promise<GoogleUser> {
    const { data, status } = await lastValueFrom(
      this.httpService.get<unknown>(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        { validateStatus: () => true },
      ),
    );

    assertSuccessfulGoogleResponse('user info request', status, data);
    return parseGoogleUser(data);
  }

  async getAccessTokenFromGoogle(
    authCode: string,
    websiteUrl: string,
  ): Promise<string> {
    const { data, status } = await lastValueFrom(
      this.httpService.post<unknown>(
        'https://oauth2.googleapis.com/token',
        stringify({
          code: authCode,
          client_id: this.configService.getOrThrow<string>(
            ENV_KEYS.GOOGLE_OAUTH_CLIENT_ID,
          ),
          client_secret: this.configService.getOrThrow<string>(
            ENV_KEYS.GOOGLE_OAUTH_CLIENT_SECRET,
          ),
          redirect_uri: `${this.configService.getOrThrow<string>(
            ENV_KEYS.SERVER_URL,
          )}/auth/google-oauth/${websiteUrl}`,
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

    assertSuccessfulGoogleResponse('token request', status, data);
    return parseAccessToken(data);
  }

  async getGoogleUser(
    authCode: string,
    websiteUrl: string,
  ): Promise<GoogleUser> {
    const accessToken = await this.getAccessTokenFromGoogle(
      authCode,
      websiteUrl,
    );

    return this.getGoogleUserFromGoogleAPI(accessToken);
  }
}
