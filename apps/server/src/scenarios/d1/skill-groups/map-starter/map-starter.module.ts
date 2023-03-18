import { Module } from '@nestjs/common';
import { UserModule } from '../../../../user/user.module';
import { MapStarterService } from './map-starter.service';
import { MapStarterSkillGroup } from './map-starter.skillgroup';

@Module({
  imports: [UserModule],
  providers: [MapStarterSkillGroup, MapStarterService],
})
export class MapStarterModule {}
