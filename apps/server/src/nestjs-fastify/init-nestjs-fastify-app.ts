import { fastifyCookie } from "@fastify/cookie";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { fastify, FastifyInstance } from "fastify";

/**
 * NestJS AppModule 클래스를 인자로 받아서 NestJS Fastify 애플리케이션을 초기화한 후 리턴한다.
 *
 * 부가적으로 아래와 같은 초기화가 함께 이루어진다.
 * 1. 쿠키 설정: Fastify 인스턴스에 @fastify/cookie 플러그인을 추가한다.
 *
 * @param appModuleClass NestJS AppModule 클래스
 * @returns 초기화가 완료된 FastifyInstance 객체
 */
export async function initNestJSFastifyApp<T>(
  appModuleClass: T
): Promise<FastifyInstance> {
  const instance = fastify();

  const app = await NestFactory.create<NestFastifyApplication>(
    appModuleClass,
    new FastifyAdapter(instance)
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SIGN_SECRET,
  });

  app.enableCors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    origin: [process.env.FRONTEND_URL!, process.env.SERVER_URL!],
    allowedHeaders: [
      "Access-Control-Request-Methods",
      "Access-Control-Request-Headers",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Authorization",
    ],
  });

  await app.init();

  return instance;
}
