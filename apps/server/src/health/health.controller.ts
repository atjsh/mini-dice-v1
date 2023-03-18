import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import type { Connection } from 'typeorm';

@Controller('health')
export class HealthController {
  // constructor(
  //   private healthCheckService: HealthCheckService,
  //   private typeOrmHealth: TypeOrmHealthIndicator,

  //   @InjectConnection()
  //   private minidiceContentDbConnection: Connection,
  // ) {}

  // @Get('detail')
  // @HealthCheck()
  // readiness() {
  //   return this.healthCheckService.check([
  //     async () =>
  //       this.typeOrmHealth.pingCheck('DB', {
  //         connection: this.minidiceContentDbConnection,
  //       }),
  //   ]);
  // }

  @Get('')
  simple() {
    return 'm';
  }
}
