import { Module } from '@nestjs/common';
import { DogdripCommonModule } from './common/dogdrip-common.module';

@Module({ imports: [DogdripCommonModule] })
export class D1Module {}
