import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
