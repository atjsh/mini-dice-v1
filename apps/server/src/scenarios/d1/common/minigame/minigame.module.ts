import { Module } from '@nestjs/common';
import { CommonMinigameService } from './minigame.service';
import { UserModule } from '../../../../user/user.module';

@Module({
  providers: [CommonMinigameService],
  exports: [CommonMinigameService],
})
export class CommonMinigameModule {}
