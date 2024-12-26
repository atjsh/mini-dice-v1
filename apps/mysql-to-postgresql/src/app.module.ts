import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from './common/datasource-names';
import { MySQLLandEntity } from './entities/mysql/mysql-land.entity';
import { MySQLMoneyCollectionParticipantsEntity } from './entities/mysql/mysql-money-collection-participants.entity';
import { MySQLSkillLogEntity } from './entities/mysql/mysql-skill-log.entity';
import { MySQLUserActivityEntity } from './entities/mysql/mysql-user-activity.entity';
import { MySQLUserLandCommentEntity } from './entities/mysql/mysql-user-land-comment.entity';
import { MySQLUserEntity } from './entities/mysql/mysql-user.entity';
import { PgLandEntity } from './entities/postgresql/pg-land.entity';
import { PgMoneyCollectionParticipantEntity } from './entities/postgresql/pg-money-collection-participants.entity';
import { PgRefreshTokenEntity } from './entities/postgresql/pg-refresh-token.entity';
import { PgSkillLogEntity } from './entities/postgresql/pg-skill-log.entity';
import { PgUserActivityEntity } from './entities/postgresql/pg-user-activity.entity';
import { PgUserLandCommentEntity } from './entities/postgresql/pg-user-land-comment.entity';
import { PgUserEntity } from './entities/postgresql/pg-user.entity';
import {
  CONFIG_KEYS,
  GLOBAL_CONFIG_MODULES,
} from './enviroment-variable-config';
import { MigratorModule } from './migrator/migrator.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PgRpsgameEntity } from './entities/postgresql/pg-rpsgame.entity';

@Module({
  imports: [
    ...GLOBAL_CONFIG_MODULES,

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.getOrThrow(CONFIG_KEYS.REDIS_HOST),
          port: +configService.getOrThrow(CONFIG_KEYS.REDIS_PORT),
          password:
            configService.getOrThrow(CONFIG_KEYS.REDIS_PASSWORD) || undefined,
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: DATASOURCE_NAMES.POSTGRESQL,
      useFactory: (configService: ConfigService) => ({
        name: DATASOURCE_NAMES.POSTGRESQL,
        type: 'postgres',
        host: configService.getOrThrow(CONFIG_KEYS.DB_PG_HOST),
        port: +configService.getOrThrow(CONFIG_KEYS.DB_PG_PORT),
        username: configService.getOrThrow(CONFIG_KEYS.DB_PG_USERNAME),
        password: configService.getOrThrow(CONFIG_KEYS.DB_PG_PASSWORD),
        database: configService.getOrThrow(CONFIG_KEYS.DB_PG_DATABASE),
        synchronize: false,
        logging: true,
        entities: [
          PgUserEntity,
          PgUserActivityEntity,
          PgSkillLogEntity,
          PgLandEntity,
          PgMoneyCollectionParticipantEntity,
          PgUserLandCommentEntity,
          PgRefreshTokenEntity,
          PgRpsgameEntity,
        ],
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: DATASOURCE_NAMES.MYSQL,
      useFactory: (configService: ConfigService) => ({
        name: DATASOURCE_NAMES.MYSQL,
        type: 'mysql',
        host: configService.getOrThrow(CONFIG_KEYS.DB_MYSQL_HOST),
        port: +configService.getOrThrow(CONFIG_KEYS.DB_MYSQL_PORT),
        username: configService.getOrThrow(CONFIG_KEYS.DB_MYSQL_USERNAME),
        password: configService.getOrThrow(CONFIG_KEYS.DB_MYSQL_PASSWORD),
        database: configService.getOrThrow(CONFIG_KEYS.DB_MYSQL_DATABASE),
        synchronize: false,
        logging: true,
        entities: [
          MySQLUserEntity,
          MySQLUserActivityEntity,
          MySQLSkillLogEntity,
          MySQLLandEntity,
          MySQLMoneyCollectionParticipantsEntity,
          MySQLUserLandCommentEntity,
        ],
      }),
    }),

    MigratorModule,
  ],
})
export class AppModule {}
