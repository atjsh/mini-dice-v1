import { Module } from '@nestjs/common';
import { RpsService } from './rps.service';
import { RpsController } from './rps.controller';

@Module({
  controllers: [RpsController],
  providers: [RpsService]
})
export class RpsModule {}
