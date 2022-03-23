import { Module } from '@nestjs/common';
import { CarAccidentService } from './car-accident.service';
import { CarAccidentSkillGroup } from './car-accident.skillgroup';

@Module({
  providers: [CarAccidentSkillGroup, CarAccidentService],
})
export class CarAccidentModule {}
