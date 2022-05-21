import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityEntity } from './user-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivityEntity])],
})
export class UserActivityModule {}
