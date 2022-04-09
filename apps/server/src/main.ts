import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import helmet from 'fastify-helmet';
import { AppModule } from './app.module';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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
      `${configService.get('SERVER_URL')}`,
      `${configService.get('WEB_URL')}`,
      /\.mini-dice\.com$/,
    ],
  });

  await app.listen(+configService.get('SERVER_PORT'), '0.0.0.0');
}
bootstrap();
