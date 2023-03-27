import { Module } from '@nestjs/common';
import { MapCycleLandEventModule } from './map-cycle/map-cycle.land-event';
import { MoneyCollectionLandEventModule } from './money-collection/money-collection.land-event';
import { RealEstateLandEventModule } from './real-estate/real-estate.land-event';

@Module({
  imports: [
    MapCycleLandEventModule,
    RealEstateLandEventModule,
    MoneyCollectionLandEventModule,
  ],
})
export class D1LandEventModule {}
