import { Module } from '@nestjs/common';
import { CarAccidentService } from './car-accident.service';
import { CarAccidentController } from './car-accident.controller';

@Module({
  controllers: [CarAccidentController],
  providers: [CarAccidentService]
})
export class CarAccidentModule {}
