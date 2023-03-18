import { AppModule } from './app.module';
import { getNestJSFastifyAppLambdaHandler } from './nestjs-fastify';

export const { lambdaHandler } = getNestJSFastifyAppLambdaHandler(AppModule);
