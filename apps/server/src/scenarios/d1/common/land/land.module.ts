import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'apps/server/src/user/user.module';
import { LandEntity } from './entity/land.entity';
import { CommonLandService } from './land.service';

@Module({
  imports: [TypeOrmModule.forFeature([LandEntity]), UserModule],
  providers: [CommonLandService],
  exports: [CommonLandService],
})
export class CommonLandModule {}
