import { Module } from '@nestjs/common';
import { FireService } from './fire.service';
import { FireSkillGroup } from './fire.skillgroup';

@Module({
  providers: [FireSkillGroup, FireService],
})
export class FireModule {}
