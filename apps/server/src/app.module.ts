import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { GoogleOAuthModule } from './auth/google-oauth/google-oauth.module';
import { LocalJwtModule } from './auth/local-jwt/local-jwt.module';
import { CacheProxyModule } from './cache-proxy/cache-proxy.module';
import { DiceTossModule } from './dice-toss/dice-toss.module';
import { HealthModule } from './health/health.module';
import { HttpRequestResponseLoggingInterceptor } from './logging/http-req-res-logger.interceptor';
import { LoggingModule } from './logging/logging.module';
import { ProfileModule } from './profile/profile.module';
import { RecentSkillLogsModule } from './recent-skill-logs/recent-skill-logs.module';
import { D1Module } from './scenarios/d1/d1.module';
import { SkillGroupAliasesModule } from './skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { TempSignupModule } from './temp-signup/temp-signup.module';
import { UpbitApiModule } from './upbit-api/upbit-api.module';
import { UserInteractionWebModule } from './user-interaction-web/user-interaction-web.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile:
        process.env.APP_ENV === 'prod' ||
        process.env.APP_ENV === 'local_docker', // NODE_ENV가 pord이거나 local_docker(개인용 도커 환경)인 경우 환경변수 파일을 가져와 사용하지 않음. 대신 주입된 환경변수를 사용함.
      envFilePath:
        process.env.APP_ENV === 'local' || process.env.APP_ENV === undefined
          ? 'tdol-process.env' // NODE_ENV가 local이거나 미지정된 경우
          : `tdol-process.env.${process.env.APP_ENV}`, // NODE_ENV가 local이 아닌 값으로 지정된 경우
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
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        cache: {
          type: 'redis',
          options: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get<number>('REDIS_PORT')!,
            prefix: `minidice:dbcache::`,
          },
        },
      }),
      inject: [ConfigService],
    }),
    CacheProxyModule,

    LocalJwtModule,
    GoogleOAuthModule,
    TempSignupModule,

    UpbitApiModule,
    SkillGroupAliasesModule,

    UserModule,
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
  ],
})
export class AppModule {}
