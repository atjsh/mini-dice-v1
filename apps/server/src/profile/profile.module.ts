import { Module } from '@nestjs/common';
import { PublicProfileService } from './profile.service';
import { PublicProfileController } from './profile.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PublicProfileController],
  providers: [PublicProfileService],
})
export class ProfileModule {}
