import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  root(): string {
    return 'contact: lifegame2021team@gmail.com';
  }
}
