import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityEntity } from './user-activity.entity';
import { UserActivityService } from './user-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivityEntity])],
  providers: [UserActivityService],
})
export class UserActivityModule {}
