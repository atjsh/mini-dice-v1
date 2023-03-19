import { Module } from '@nestjs/common';
import { CommonMinigameService } from './minigame.service';

@Module({
  providers: [CommonMinigameService],
  exports: [CommonMinigameService],
})
export class CommonMinigameModule {}
