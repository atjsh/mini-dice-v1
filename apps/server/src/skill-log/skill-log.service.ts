import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  decodeSkillLogPayload,
  encodeSkillLogPayload,
} from '@packages/skill-log-codec';
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

  private hydratePayload<T extends SkillLogEntity>(log: T): T {
    if (log.payload && log.payloadCodec) {
      const decodedPayload = decodeSkillLogPayload(
        log.payload,
        log.payloadCodec,
      );

      log.userActivity = decodedPayload.userActivity as any;
      log.skillServiceResult = decodedPayload.skillServiceResult as any;
    }

    return log;
  }

  async createLog(dto: CreateLogDto) {
    const skillServiceResult =
      (dto.skillServiceResult as any) == '' ? null : dto.skillServiceResult;
    const encodedPayload = encodeSkillLogPayload({
      userActivity: dto.userActivity ?? null,
      skillServiceResult: skillServiceResult ?? null,
    });
    const savedLog = await this.repository.save(
      this.repository.create({
        ...dto,
        ...encodedPayload,
        userActivity: null,
        skillServiceResult: null,
      }),
    );

    return Object.assign(savedLog, {
      userActivity: dto.userActivity,
      skillServiceResult,
    });
  }

  async getLatestLog(dto: GetRecentLogsDto) {
    const logs = await this.repository.find({
      take: dto.limit,
      where: {
        userId: dto.userId,
      },
      order: {
        date: 'DESC',
        id: 'DESC',
      },
    });

    return logs.map((log) => this.hydratePayload(log));
  }

  async getLastLog(userId: UserEntity['id']) {
    const log = await this.repository.findOne({
      where: {
        userId,
      },
      order: {
        date: 'DESC',
        id: 'DESC',
      },
    });

    return log ? this.hydratePayload(log) : null;
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
