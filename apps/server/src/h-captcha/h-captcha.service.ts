import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';
import { ENV_KEYS } from '../config/enviorment-variable-config';

@Injectable()
export class HCaptchaService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async verify(clientResponse: string) {
    const response = await lastValueFrom(
      this.httpService.post<{ success: true }>(
        'https://hcaptcha.com/siteverify',
        stringify({
          response: clientResponse,
          secret: this.configService.getOrThrow(ENV_KEYS.HCAPTCHA_SECRET_KEY),
        }),
      ),
    );

    return response.data.success;
  }
}
