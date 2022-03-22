import { Module } from '@nestjs/common';
import { Land1Service } from './land1.service';
import { Land1Controller } from './land1.controller';
import { CommonLandModule } from '../../common/land/land.module';

@Module({
  imports: [CommonLandModule],
  controllers: [Land1Controller],
  providers: [Land1Service],
})
export class Land1Module {}
