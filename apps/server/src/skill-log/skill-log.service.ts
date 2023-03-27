import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SkillLogEntity } from './entity/skill-log.entity';

export class GetRecentLogsDto {
  userId: UserEntity['id'];
  limit: number;
}

export type CreateLogDto = Pick<
  SkillLogEntity,
  'userId' | 'skillRoute' | 'skillServiceResult' | 'userActivity'
>;

@Injectable()
export class SkillLogService {
  constructor(
    @InjectRepository(SkillLogEntity)
    private repository: Repository<SkillLogEntity>,
  ) {}

  async createLog(dto: CreateLogDto) {
    return await this.repository.save({
      ...dto,
      skillServiceResult:
        (dto.skillServiceResult as any) == ''
          ? undefined
          : dto.skillServiceResult,
    });
  }

  async getLatestLog(dto: GetRecentLogsDto) {
    return await this.repository.find({
      take: dto.limit,
      where: {
        userId: dto.userId,
      },
      order: {
        date: 'DESC',
      },
    });
  }

  async getLastLog(userId: UserEntity['id']) {
    const log = await this.repository.findOne({
      where: {
        userId,
      },
      order: {
        date: 'DESC',
      },
    });

    return log;
  }

  async getLastLogOrCreateOne(dto: CreateLogDto) {
    const log = await this.getLastLog(dto.userId);

    if (log) {
      return {
        isCreated: false,
        log,
      };
    }

    return {
      isCreated: true,
      log: await this.createLog(dto),
    };
  }
}
