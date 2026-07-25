import type { PromiseHandler } from '@fastify/aws-lambda';
import awsLambdaFastify from '@fastify/aws-lambda';
import type { Type } from '@nestjs/common';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { initNestJSFastifyApp } from './init-nestjs-fastify-app';

export function getNestJSFastifyAppLambdaHandler(
  appModuleClass: Type<unknown>,
) {
  let cachedLambdaHandler: PromiseHandler;

  const lambdaHandler = async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    if (!cachedLambdaHandler) {
      cachedLambdaHandler = awsLambdaFastify(
        await initNestJSFastifyApp(appModuleClass),
      );
    }

    return await cachedLambdaHandler(event, context);
  };

  return { lambdaHandler };
}
