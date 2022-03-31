import { Module } from '@nestjs/common';
import { GameDevService } from './game-dev.service';
import { GameDevSkillGroup } from './game-dev.skillgroup';

@Module({
  providers: [GameDevSkillGroup, GameDevService],
})
export class GameDevModule {}
