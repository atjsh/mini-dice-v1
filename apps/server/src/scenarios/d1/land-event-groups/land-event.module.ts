import { Module } from '@nestjs/common';
import { MapCycleLandEventModule } from './map-cycle/map-cycle.land-event';

@Module({ imports: [MapCycleLandEventModule] })
export class D1LandEventModule {}
