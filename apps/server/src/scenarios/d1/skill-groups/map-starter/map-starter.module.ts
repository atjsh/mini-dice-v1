import { Module } from '@nestjs/common';
import { UserModule } from 'apps/server/src/user/user.module';
import { MapStarterController } from './map-starter.controller';
import { MapStarterService } from './map-starter.service';

@Module({
  imports: [UserModule],
  controllers: [MapStarterController],
  providers: [MapStarterService],
})
export class MapStarterModule {}
