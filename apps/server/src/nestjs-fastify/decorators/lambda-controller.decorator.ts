import { applyDecorators, Controller } from "@nestjs/common";

export interface LambdaControllerOptions {
  /**
   * 람다에 할당된 API Gateway의 경로를 명시하고자 할 때 사용한다.
   *
   * 보통은 이 값을 설정해두지 않아도 된다. 하지만, Controller에 '하위 경로'가 존재하는 경우
   * (예: "/blog-posts/:postId/comments"와 같이 가변적인 하위 경로가 존재할 때)
   * explicitRoute 값을 람다에 할당된 API Gateway의 경로로 설정해야 한다.
   * 왜냐하면 현재 NestJS 애플리케이션에서는 "*"(애스터리스크; 와일드 카드의 의미를 갖는 경로값) 경로 아래로 가변적인 하위 경로를 설정하는 것이 불가하기 때문이다.
   */
  explicitRoute?: string;
}

export interface LambdaEndpointOptions {
  /**
   * 람다에 할당된 API Gateway의 경로를 명시하고자 할 때 사용한다.
   *
   * 보통은 이 값을 설정해두지 않아도 된다. 하지만, Controller에 '하위 경로'가 존재하는 경우
   * (예: "/blog-posts/:postId/comments"와 같이 가변적인 하위 경로가 존재할 때)
   * explicitRoute 값을 람다에 할당된 API Gateway의 경로로 설정해야 한다.
   * 왜냐하면 현재 NestJS 애플리케이션에서는 "*"(애스터리스크; 와일드 카드의 의미를 갖는 경로값) 경로 아래로 가변적인 하위 경로를 설정하는 것이 불가하기 때문이다.
   */
  explicitRoute?: string;
}

export const LambdaController = (options?: LambdaControllerOptions) =>
  applyDecorators(Controller(options?.explicitRoute ?? "*"));

export const LambdaEndpoint = (
  method: (path?: string | string[]) => MethodDecorator,
  options?: LambdaEndpointOptions
) => applyDecorators(method(options?.explicitRoute ?? undefined));
