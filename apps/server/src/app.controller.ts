import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  root(): string {
    return 'lifegame2021team@gmail.com';
  }
}
