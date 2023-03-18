import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { GoogleOAuthModule } from './auth/google-oauth/google-oauth.module';
import { LocalJwtModule } from './auth/local-jwt/local-jwt.module';
import { CacheProxyModule } from './cache-proxy/cache-proxy.module';
import { DiceTossModule } from './dice-toss/dice-toss.module';
import { FrontendErrorModule } from './frontend-error-collection/frontend-error.module';
import { HealthModule } from './health/health.module';
import { HttpExceptionLoggingFilter } from './logging/http-exception.filter';
import { HttpRequestResponseLoggingInterceptor } from './logging/http-req-res-logger.interceptor';
import { LoggingModule } from './logging/logging.module';
import { ProfileModule } from './profile/profile.module';
import { RecentSkillLogsModule } from './recent-skill-logs/recent-skill-logs.module';
import { D1Module } from './scenarios/d1/d1.module';
import { SkillGroupAliasesModule } from './skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { TempSignupModule } from './temp-signup/temp-signup.module';
import { UpbitApiModule } from './upbit-api/upbit-api.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { UserInteractionWebModule } from './user-interaction-web/user-interaction-web.module';
import { UserLandCommentModule } from './user-land-comment/user-land-comment.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { LandEntity } from './scenarios/d1/common';
import { MoneyCollectionEntity } from './scenarios/d1/common/money-collection/entity/money-collection.entity';
import { MoneyCollectionParticipantsEntity } from './scenarios/d1/common/money-collection/entity/money-collection-participants.entity';
import { SkillLogEntity } from './skill-log/entity/skill-log.entity';
import { UserActivityEntity } from './user-activity/user-activity.entity';
import { UserLandCommentEntity } from './user-land-comment/entities/user-land-comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        SERVER_PORT: Joi.number().required(),

        WEB_URL: Joi.string().required(),

        DB_URL: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),

        HCAPTCHA_SECRET_KEY: Joi.string().required(),

        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLILENT_SECRET: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_URL'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: false,
        logging: false,
        cache: {
          type: 'redis',
          options: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get<number>('REDIS_PORT')!,
            auth_pass: configService.get('REDIS_PASSWORD'),
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
