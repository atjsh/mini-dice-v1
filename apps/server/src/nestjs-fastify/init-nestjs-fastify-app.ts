import { fastifyCookie } from '@fastify/cookie';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { FastifyInstance } from 'fastify';
import { fastify } from 'fastify';
import { ENV_KEYS } from '../config/enviorment-variable-config';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * NestJS AppModule 클래스를 인자로 받아서 NestJS Fastify 애플리케이션을 초기화한 후 리턴한다.
 *
 * @param appModuleClass NestJS AppModule 클래스
 * @returns 초기화가 완료된 FastifyInstance 객체
 */
export async function initNestJSFastifyApp<T>(
  appModuleClass: T,
): Promise<FastifyInstance> {
  const instance = fastify();

  const app = await NestFactory.create<NestFastifyApplication>(
    appModuleClass,
    new FastifyAdapter(instance),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie, {
    secret: configService.getOrThrow(ENV_KEYS.COOKIE_SIGN_SECRET),
  });

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    origin: [
      configService.getOrThrow(ENV_KEYS.WEB_URL),
      configService.getOrThrow(ENV_KEYS.SERVER_URL),
    ],
    allowedHeaders: [
      'Access-Control-Request-Methods',
      'Access-Control-Request-Headers',
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Authorization',
      'timezone',
    ],
  });

  await app.init();

  return instance;
}
