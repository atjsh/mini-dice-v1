import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATASOURCE_NAMES } from '../common/datasource-names';
import { MySQLLandEntity } from '../entities/mysql/mysql-land.entity';
import { MySQLMoneyCollectionParticipantsEntity } from '../entities/mysql/mysql-money-collection-participants.entity';
import { MySQLSkillLogEntity } from '../entities/mysql/mysql-skill-log.entity';
import { MySQLUserActivityEntity } from '../entities/mysql/mysql-user-activity.entity';
import { MySQLUserLandCommentEntity } from '../entities/mysql/mysql-user-land-comment.entity';
import { MySQLUserEntity } from '../entities/mysql/mysql-user.entity';
import { PgLandEntity } from '../entities/postgresql/pg-land.entity';
import { PgMoneyCollectionParticipantEntity } from '../entities/postgresql/pg-money-collection-participants.entity';
import { PgRefreshTokenEntity } from '../entities/postgresql/pg-refresh-token.entity';
import { PgSkillLogEntity } from '../entities/postgresql/pg-skill-log.entity';
import { PgUserActivityEntity } from '../entities/postgresql/pg-user-activity.entity';
import { PgUserLandCommentEntity } from '../entities/postgresql/pg-user-land-comment.entity';
import { PgUserEntity } from '../entities/postgresql/pg-user.entity';
import { LandDataConvertorService } from './data-convertors/land.data-convertor.service';
import { MoneyCollectionParticipantDataConvertorService } from './data-convertors/money-collection-participant.data-convertor.service';
import { RefreshTokenDataConvertorService } from './data-convertors/refresh-token.data-convertor.service';
import { SkillLogDataConvertorService } from './data-convertors/skill-log.data-convertor.service';
import { UserActivityDataConvertorService } from './data-convertors/user-activity.data-convertor.service';
import { UserDataConvertorService } from './data-convertors/user.data-convertor.service';
import { MigratorController } from './migrator.controller';
import { MigratorServicce } from './migrator.service';
import { UserLandCommentDataConvertor } from './data-convertors/user-land-comment.data-convertor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        MySQLLandEntity,
        MySQLMoneyCollectionParticipantsEntity,
        MySQLSkillLogEntity,
        MySQLUserActivityEntity,
        MySQLUserEntity,
        MySQLUserLandCommentEntity,
      ],
      DATASOURCE_NAMES.MYSQL,
    ),
    TypeOrmModule.forFeature(
      [
        PgLandEntity,
        PgMoneyCollectionParticipantEntity,
        PgRefreshTokenEntity,
        PgSkillLogEntity,
        PgUserActivityEntity,
        PgUserEntity,
        PgUserLandCommentEntity,
      ],
      DATASOURCE_NAMES.POSTGRESQL,
    ),
  ],
  providers: [
    ...[
      UserDataConvertorService,
      SkillLogDataConvertorService,
      UserActivityDataConvertorService,
      MoneyCollectionParticipantDataConvertorService,
      LandDataConvertorService,
      UserLandCommentDataConvertor,
      RefreshTokenDataConvertorService,
    ],
    MigratorServicce,
  ],
  controllers: [MigratorController],
})
export class MigratorModule {}
