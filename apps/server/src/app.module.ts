import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { AppController } from './app.controller';
import { GoogleOAuthModule } from './auth/google-oauth/google-oauth.module';
import { LocalJwtModule } from './auth/local-jwt/local-jwt.module';
import { RefreshTokenV2Entity } from './auth/local-jwt/refresh-token/entity/refresh-token-v2.entity';
import { PasskeyModule } from './auth/passkey/passkey.module';
import { PasskeyEntity } from './auth/passkey/entity/passkey.entity';
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
import { PushSubscriptionEntity } from './push-notification/entities/push-subscription.entity';
import { UserOnlineSessionEntity } from './push-notification/entities/user-online-session.entity';
import { RecentSkillLogsModule } from './recent-skill-logs/recent-skill-logs.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { D1Module } from './scenarios/d1/d1.module';
import { LandEntity } from './scenarios/d1/common/land/entity/land.entity';
import { MoneyCollectionParticipantsEntity } from './scenarios/d1/common/money-collection/entity/money-collection-participants.entity';
import { RpsgameEntity } from './scenarios/d1/common/rpsgame/rpsgame.entity';
import { SkillLogEntity } from './skill-log/entity/skill-log.entity';
import { SkillGroupAliasesModule } from './skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { TempSignupModule } from './temp-signup/temp-signup.module';
import { PgStatCashTimeSeriesEntity } from './stat/entities/pg-stat-cash-time-series.entity';
import { PgStatStockTimeSeriesEntity } from './stat/entities/pg-stat-stock-time-series.entity';
import { UpbitApiModule } from './upbit-api/upbit-api.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { UserActivityEntity } from './user-activity/user-activity.entity';
import { UserInteractionWebModule } from './user-interaction-web/user-interaction-web.module';
import { UserLandCommentModule } from './user-land-comment/user-land-comment.module';
import { UserLandCommentEntity } from './user-land-comment/entities/user-land-comment.entity';
import { UserPreferenceModule } from './user-preference/user-preference.module';
import { UserPreferenceEntity } from './user-preference/entity/user-preference.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';

@Module({
  imports: [
    ...APP_GLOBAL_CONFIG_MODULES,

    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes in milliseconds
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow(ENV_KEYS.DB_URL),
          port: +configService.getOrThrow(ENV_KEYS.DB_PORT),
          username: configService.getOrThrow(ENV_KEYS.DB_USER),
          password: configService.getOrThrow(ENV_KEYS.DB_PASSWORD),
          database: configService.getOrThrow(ENV_KEYS.DB_DATABASE),
          synchronize: false,
          entities: [
            UserEntity,
            LandEntity,
            MoneyCollectionParticipantsEntity,
            SkillLogEntity,
            UserActivityEntity,
            UserLandCommentEntity,
            UserPreferenceEntity,
            RefreshTokenV2Entity,
            RpsgameEntity,
            PasskeyEntity,
            PushSubscriptionEntity,
            UserOnlineSessionEntity,
            PgStatCashTimeSeriesEntity,
            PgStatStockTimeSeriesEntity,
          ],
          ssl:
            configService.getOrThrow(ENV_KEYS.DB_SSL_MODE_REQUIRED) !== 'false'
              ? {
                  ca:
                    configService.getOrThrow(ENV_KEYS.DB_SSL_CA_FILE_PATH) !==
                    'null'
                      ? readFileSync(
                          `${__dirname}/${configService.getOrThrow(
                            ENV_KEYS.DB_SSL_CA_FILE_PATH,
                          )}`,
                        )
                      : undefined,
                }
              : undefined,
        };
      },
      inject: [ConfigService],
    }),

    LocalJwtModule,
    GoogleOAuthModule,
    PasskeyModule,
    TempSignupModule,

    UpbitApiModule,
    SkillGroupAliasesModule,

    FrontendErrorModule,

    UserModule,
    UserLandCommentModule,
    UserPreferenceModule,
    UserActivityModule,
    ProfileModule,
    UserInteractionWebModule,
    DiceTossModule,
    RecentSkillLogsModule,
    PushNotificationModule,

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
