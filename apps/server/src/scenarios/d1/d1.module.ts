import { Module } from '@nestjs/common';
import { D1CommonModule } from './common/d1-common.module';

@Module({ imports: [D1CommonModule] })
export class D1Module {}
