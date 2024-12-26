import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const ENV_KEYS = {
  SERVER_URL: 'SERVER_URL',
  SERVER_PORT: 'SERVER_PORT',
  WEB_URL: 'WEB_URL',

  DB_URL: 'DB_URL',
  DB_PORT: 'DB_PORT',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
  DB_SSL_MODE_REQUIRED: 'DB_SSL_MODE_REQUIRED',

  JWT_SECRET: 'JWT_SECRET',
  COOKIE_SIGN_SECRET: 'COOKIE_SIGN_SECRET',

  HCAPTCHA_SECRET_KEY: 'HCAPTCHA_SECRET_KEY',

  GOOGLE_OAUTH_CLIENT_ID: 'GOOGLE_OAUTH_CLIENT_ID',
  GOOGLE_OAUTH_CLIENT_SECRET: 'GOOGLE_OAUTH_CLIENT_SECRET',

  ADS_TXT: 'ADS_TXT',
};

const envFileValidationSchema = Joi.object(
  Object.values(ENV_KEYS)
    .map((variableName) => ({
      [variableName]: Joi.string().required(),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
);

export const APP_GLOBAL_CONFIG_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: envFileValidationSchema,
  }),
];
