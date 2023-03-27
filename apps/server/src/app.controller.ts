import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('')
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('')
  root(): string {
    return 'contact: lifegame2021team@gmail.com';
  }

  @Get('ads.txt')
  adsTxt(): string {
    return this.configService.getOrThrow('ADS_TXT');
  }
}
