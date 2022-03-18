import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppTestControlelr } from './app-test.controller';
import { GoogleOAuthModule } from './auth/google-oauth/google-oauth.module';
import { LocalJwtModule } from './auth/local-jwt/local-jwt.module';
import { ProfileModule } from './profile/profile.module';
import { TempSignupModule } from './temp-signup/temp-signup.module';
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
        APP_URL: Joi.string().required(),
        APP_SERVICE_NAME: Joi.string().required(),
        APP_PORT: Joi.number().required(),

        FRONT_URL: Joi.string().required(),

        DB_URL: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),

        HCAPTCHA_SECRET_KEY: Joi.string().required(),

        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLILENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REDIRECT_URI: Joi.string().required(),
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
      }),
      inject: [ConfigService],
    }),

    LocalJwtModule,
    GoogleOAuthModule,
    TempSignupModule,

    UserModule,
    ProfileModule,
  ],
  controllers: [AppTestControlelr],
})
export class AppModule {}
