import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { PgLandEntity } from '../entities/postgresql/pg-land.entity';
import { PgMoneyCollectionParticipantEntity } from '../entities/postgresql/pg-money-collection-participants.entity';
import { PgRefreshTokenEntity } from '../entities/postgresql/pg-refresh-token.entity';
import { PgRpsgameEntity } from '../entities/postgresql/pg-rpsgame.entity';
import { PgSkillLogEntity } from '../entities/postgresql/pg-skill-log.entity';
import { PgStatCashAggrigationEntity } from '../entities/postgresql/pg-stat-cash-aggrigation.entity';
import { PgStatCashTimeSeriesEntity } from '../entities/postgresql/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from '../entities/postgresql/pg-stat-stock-time-series.entity';
import { PgUserActivityEntity } from '../entities/postgresql/pg-user-activity.entity';
import { PgUserLandCommentEntity } from '../entities/postgresql/pg-user-land-comment.entity';
import { PgUserEntity } from '../entities/postgresql/pg-user.entity';
import { AddSkillLogPayload1783700000000 } from '../migrations/1783700000000-AddSkillLogPayload';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function postgresOptions(): PostgresConnectionOptions {
  const caPath = process.env.DB_SSL_CA_FILE_PATH;

  return {
    name: DATASOURCE_NAMES.POSTGRESQL,
    type: 'postgres',
    host: env('DB_PG_HOST'),
    port: Number(env('DB_PG_PORT')),
    username: env('DB_PG_USERNAME'),
    password: env('DB_PG_PASSWORD'),
    database: env('DB_PG_DATABASE'),
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    entities: [
      PgUserEntity,
      PgUserActivityEntity,
      PgSkillLogEntity,
      PgLandEntity,
      PgMoneyCollectionParticipantEntity,
      PgUserLandCommentEntity,
      PgRefreshTokenEntity,
      PgRpsgameEntity,
      PgStatCashAggrigationEntity,
      PgStatCashTimeSeriesEntity,
      PgStatStockTimeSeriesEntity,
    ],
    migrations: [AddSkillLogPayload1783700000000],
    ssl:
      process.env.DB_SSL_MODE_REQUIRED === 'true'
        ? {
            rejectUnauthorized: true,
            ca:
              caPath && caPath !== 'null'
                ? readFileSync(resolve(caPath))
                : undefined,
          }
        : undefined,
  };
}
