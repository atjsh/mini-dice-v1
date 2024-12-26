import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpsgameEntity } from './rpsgame.entity';

@Injectable()
export class CommonRpsgameService {
  constructor(
    @InjectRepository(RpsgameEntity)
    private rspgameRepository: Repository<RpsgameEntity>,
  ) {}

  async getLatestRpsgame(id: string) {
    return await this.rspgameRepository.findOne({
      where: {
        id,
      },
    });
  }

  async setRpsgame(id: string, username: string, move: string) {
    await this.rspgameRepository.save(
      this.rspgameRepository.create({
        id,
        username,
        move,
      }),
    );
  }
}
