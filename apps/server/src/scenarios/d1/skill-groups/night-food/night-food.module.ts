import { Module } from '@nestjs/common';
import { NightFoodService } from './night-food.service';
import { NightFoodSkillGroup } from './night-food.skillgroup';

@Module({
  providers: [NightFoodSkillGroup, NightFoodService],
})
export class NightFoodModule {}
