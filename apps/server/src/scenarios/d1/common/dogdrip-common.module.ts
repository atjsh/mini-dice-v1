import { Module } from '@nestjs/common';
import { CommonLandModule } from './land/land.module';

@Module({
  imports: [CommonLandModule],
})
export class DogdripCommonModule {}
