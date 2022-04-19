import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  root(): string {
    return 'php: 5.4; laravel: not founded; Node.js: 1.0.2; if you want to participate, send email to: lifegame2021team@gmail.com';
  }
}
