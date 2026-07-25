import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TurnstileService } from './turnstile.service';

@Module({
  imports: [HttpModule],
  providers: [TurnstileService],
  exports: [TurnstileService],
})
export class TurnstileModule {}
