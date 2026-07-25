import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  decodeSkillLogPayload,
  encodeSkillLogPayload,
} from '@packages/skill-log-codec';
import type { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SkillLogEntity } from './entity/skill-log.entity';
import type {
  DiceUserActivity,
  StockPriceChangeResult,
  UserActivityType,
} from './types/user-activity.dto';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDiceResult(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (dice: unknown) =>
        typeof dice === 'number' &&
        Number.isInteger(dice) &&
        dice >= 1 &&
        dice <= 6,
    )
  );
}

function parseBigInt(value: unknown, field: string): bigint {
  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'number' && Number.isSafeInteger(value)) {
    return BigInt(value);
  }

  if (typeof value === 'string' && /^-?\d+$/.test(value)) {
    return BigInt(value);
  }

  throw new Error(`Invalid skill log ${field}`);
}

function parseStockPriceChange(value: unknown): StockPriceChangeResult {
  if (!isRecord(value)) {
    throw new Error('Invalid skill log stock price change');
  }

  return {
    changedStockPrice: parseBigInt(
      value.changedStockPrice,
      'changed stock price',
    ),
    stockPriceDifference: parseBigInt(
      value.stockPriceDifference,
      'stock price difference',
    ),
    forcedSoldCash:
      value.forcedSoldCash === false
        ? false
        : parseBigInt(value.forcedSoldCash, 'forced sold cash'),
  };
}

function parseDiceUserActivity(
  value: Record<string, unknown>,
): DiceUserActivity {
  if (!isDiceResult(value.diceResult)) {
    throw new Error('Invalid skill log dice result');
  }

  return {
    type: 'dice',
    diceResult: value.diceResult,
    ...(value.stockPriceChange == null
      ? {}
      : { stockPriceChange: parseStockPriceChange(value.stockPriceChange) }),
  };
}

function parseUserActivity(value: unknown): UserActivityType | null {
  if (value === null) {
    return null;
  }

  if (!isRecord(value)) {
    throw new Error('Invalid skill log user activity');
  }

  switch (value.type) {
    case 'gameStart':
      return { type: 'gameStart' };
    case 'dice':
      return parseDiceUserActivity(value);
    case 'interaction':
      if (!isRecord(value.params)) {
        throw new Error('Invalid skill log interaction parameters');
      }
      return { type: 'interaction', params: value.params };
    default:
      throw new Error('Invalid skill log user activity type');
  }
}

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

      log.userActivity = parseUserActivity(decodedPayload.userActivity);
      log.skillServiceResult = decodedPayload.skillServiceResult;
    }

    return log;
  }

  async createLog(dto: CreateLogDto) {
    const skillServiceResult =
      dto.skillServiceResult === '' ? null : dto.skillServiceResult;
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
