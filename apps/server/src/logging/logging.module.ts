import { Module } from '@nestjs/common';
import { HttpRequestResponseLoggingInterceptor } from './http-req-res-logger.interceptor';

@Module({
  providers: [HttpRequestResponseLoggingInterceptor],
  exports: [HttpRequestResponseLoggingInterceptor],
})
export class LoggingModule {}
