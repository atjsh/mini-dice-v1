import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GoogleOAuthModule } from './auth/google-oauth/google-oauth.module';
import { LocalJwtModule } from './auth/local-jwt/local-jwt.module';
import { CacheProxyModule } from './cache-proxy/cache-proxy.module';
import {
  APP_GLOBAL_CONFIG_MODULES,
  ENV_KEYS,
} from './config/enviorment-variable-config';
import { DiceTossModule } from './dice-toss/dice-toss.module';
import { FrontendErrorModule } from './frontend-error-collection/frontend-error.module';
import { HealthModule } from './health/health.module';
import { HttpExceptionLoggingFilter } from './logging/http-exception.filter';
import { HttpRequestResponseLoggingInterceptor } from './logging/http-req-res-logger.interceptor';
import { LoggingModule } from './logging/logging.module';
import { ProfileModule } from './profile/profile.module';
import { RecentSkillLogsModule } from './recent-skill-logs/recent-skill-logs.module';
import { LandEntity } from './scenarios/d1/common';
import { MoneyCollectionParticipantsEntity } from './scenarios/d1/common/money-collection/entity/money-collection-participants.entity';
import { MoneyCollectionEntity } from './scenarios/d1/common/money-collection/entity/money-collection.entity';
import { D1Module } from './scenarios/d1/d1.module';
import { SkillGroupAliasesModule } from './skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { SkillLogEntity } from './skill-log/entity/skill-log.entity';
import { TempSignupModule } from './temp-signup/temp-signup.module';
import { UpbitApiModule } from './upbit-api/upbit-api.module';
import { UserActivityEntity } from './user-activity/user-activity.entity';
import { UserActivityModule } from './user-activity/user-activity.module';
import { UserInteractionWebModule } from './user-interaction-web/user-interaction-web.module';
import { UserLandCommentEntity } from './user-land-comment/entities/user-land-comment.entity';
import { UserLandCommentModule } from './user-land-comment/user-land-comment.module';
import { UserEntity } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { parseNullString } from './common';

@Module({
  imports: [
    ...APP_GLOBAL_CONFIG_MODULES,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow(ENV_KEYS.DB_URL),
        port: +configService.getOrThrow(ENV_KEYS.DB_PORT),
        username: configService.getOrThrow(ENV_KEYS.DB_USER),
        password: configService.getOrThrow(ENV_KEYS.DB_PASSWORD),
        database: configService.getOrThrow(ENV_KEYS.DB_DATABASE),
        synchronize: false,
        logging: false,
        cache: {
          type: 'redis',
          options: {
            host: configService.getOrThrow(ENV_KEYS.REDIS_HOST),
            port: +configService.getOrThrow<number>(ENV_KEYS.REDIS_PORT),
            auth_pass: parseNullString(
              configService.getOrThrow(ENV_KEYS.REDIS_PASSWORD),
            ),
            prefix: `minidice:dbcache::`,
          },
        },
        entities: [
          UserEntity,
          LandEntity,
          MoneyCollectionEntity,
          MoneyCollectionParticipantsEntity,
          SkillLogEntity,
          UserActivityEntity,
          UserLandCommentEntity,
        ],
      }),
      inject: [ConfigService],
    }),
    CacheProxyModule,

    LocalJwtModule,
    GoogleOAuthModule,
    TempSignupModule,

    UpbitApiModule,
    SkillGroupAliasesModule,

    FrontendErrorModule,

    UserModule,
    UserLandCommentModule,
    UserActivityModule,
    ProfileModule,
    UserInteractionWebModule,
    DiceTossModule,
    RecentSkillLogsModule,

    D1Module,

    DiscoveryModule,

    LoggingModule,

    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestResponseLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionLoggingFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
