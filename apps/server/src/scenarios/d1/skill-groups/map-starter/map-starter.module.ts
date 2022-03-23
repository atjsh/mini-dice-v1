import { Module } from '@nestjs/common';
import { UserModule } from 'apps/server/src/user/user.module';
import { MapStarterSkillGroup } from './map-starter.skillgroup';
import { MapStarterService } from './map-starter.service';

@Module({
  imports: [UserModule],
  providers: [MapStarterSkillGroup, MapStarterService],
})
export class MapStarterModule {}
