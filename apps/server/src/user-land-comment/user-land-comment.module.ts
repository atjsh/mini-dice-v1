import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillLogModule } from '../skill-log/skill-log.module';
import { UserLandCommentEntity } from './entities/user-land-comment.entity';
import { UserLandCommentController } from './user-land-comment.controller';
import { UserLandCommentService } from './user-land-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLandCommentEntity]), SkillLogModule],
  controllers: [UserLandCommentController],
  providers: [UserLandCommentService],
  exports: [UserLandCommentService],
})
export class UserLandCommentModule {}
