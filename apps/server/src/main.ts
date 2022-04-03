import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from 'fastify-helmet';
import { AppModule } from './app.module';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

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

  app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });

  app.enableCors({
    credentials: true,
    origin: [
      `${configService.get('APP_URL')}`,
      `${configService.get('FRONT_URL')}`,
      /\.mini-dice\.com$/,
    ],
  });

  await app.listen(+configService.get('APP_PORT'), '0.0.0.0');
}
bootstrap();
