import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLandCommentModule } from '../user-land-comment/user-land-comment.module';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserLandCommentModule],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
