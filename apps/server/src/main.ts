import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'fastify-helmet';
import { ConfigService } from '@nestjs/config';

const API_NAME = 'mini-dice Server';
const API_CURRENT_VERSION = '3.0.0';
const API_DESCRIPTION = `
<br> - <a href="/docs/swagger-ui">swagger-ui</a>
`;
const SWAGGER_URL = 'docs/swagger-ui';

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

  app.enableCors({
    credentials: true,
    origin: [
      `${configService.get('APP_URL')}`,
      `${configService.get('FRONT_URL')}`,
    ],
  });

  const options = new DocumentBuilder()
    .setTitle(API_NAME)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_URL, app, document);

  await app.listen(+configService.get('APP_PORT'));
}
bootstrap();
