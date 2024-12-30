import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const CONFIG_KEYS = {
  DB_MYSQL_HOST: 'DB_MYSQL_HOST',
  DB_MYSQL_PORT: 'DB_MYSQL_PORT',
  DB_MYSQL_USERNAME: 'DB_MYSQL_USERNAME',
  DB_MYSQL_PASSWORD: 'DB_MYSQL_PASSWORD',
  DB_MYSQL_DATABASE: 'DB_MYSQL_DATABASE',

  DB_PG_HOST: 'DB_PG_HOST',
  DB_PG_PORT: 'DB_PG_PORT',
  DB_PG_USERNAME: 'DB_PG_USERNAME',
  DB_PG_PASSWORD: 'DB_PG_PASSWORD',
  DB_PG_DATABASE: 'DB_PG_DATABASE',

  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
} as const;

const envFileValidationSchema = Joi.object(
  Object.values(CONFIG_KEYS)
    .map((variableName) => ({
      [variableName]: Joi.string().required(),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
);

export const GLOBAL_CONFIG_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: envFileValidationSchema,
  }),
];
