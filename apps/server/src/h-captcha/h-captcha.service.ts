import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { lastValueFrom } from 'rxjs';

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
          secret: this.configService.get('HCAPTCHA_SECRET_KEY'),
        }),
      ),
    );

    return response.data.success;
  }
}
