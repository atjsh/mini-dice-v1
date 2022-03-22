import { Module } from '@nestjs/common';
import { NightFoodService } from './night-food.service';
import { NightFoodController } from './night-food.controller';

@Module({
  controllers: [NightFoodController],
  providers: [NightFoodService]
})
export class NightFoodModule {}
