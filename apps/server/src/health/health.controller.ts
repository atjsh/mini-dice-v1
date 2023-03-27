import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('detail')
  readiness() {
    return 'OK';
  }

  @Get('')
  simple() {
    return 'm';
  }
}
