import type { PromiseHandler } from "@fastify/aws-lambda";
import awsLambdaFastify from "@fastify/aws-lambda";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { initNestJSFastifyApp } from "./init-nestjs-fastify-app";
import { config } from "dotenv";

export function getNestJSFastifyAppLambdaHandler<T extends unknown>(
  appModuleClass: T
) {
  let cachedLambdaHandler: PromiseHandler;

  const lambdaHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    config();

    if (!cachedLambdaHandler) {
      cachedLambdaHandler = awsLambdaFastify(
        await initNestJSFastifyApp(appModuleClass)
      );
    }

    return await cachedLambdaHandler(event, context);
  };

  return { lambdaHandler };
}
