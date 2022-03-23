import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { DogdripCommonModule } from './common/dogdrip-common.module';
import { D1Controller } from './d1.controller';

@Module({
  imports: [DiscoveryModule, DogdripCommonModule],
  controllers: [D1Controller],
})
export class D1Module {}
