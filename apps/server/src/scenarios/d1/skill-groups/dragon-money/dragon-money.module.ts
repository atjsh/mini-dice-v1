import { Module } from '@nestjs/common';
import { DragonMoneyService } from './dragon-money.service';
import { DragonMoneySkillGroup } from './dragon-money.skillgroup';

@Module({
  providers: [DragonMoneyService, DragonMoneySkillGroup],
})
export class DragonMoneyModule {}
