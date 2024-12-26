import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonRpsgameService } from './common-rpsgame.service';
import { RpsgameEntity } from './rpsgame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RpsgameEntity])],
  providers: [CommonRpsgameService],
  exports: [CommonRpsgameService],
})
export class CommonRpsgameModule {}
