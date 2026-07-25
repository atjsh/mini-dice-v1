import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import type { FastifyRequest } from 'fastify';

/**
 * Http 요청/응답 간 주고받은 데이터를 로깅하는 인터셉터.
 */
@Injectable()
export class HttpRequestResponseLoggingInterceptor implements NestInterceptor<
  unknown,
  unknown
> {
  private readonly logger = new Logger();

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<FastifyRequest>();
    const now = Date.now();
    const requestId = randomUUID();

    const controllerName = context.getClass().name || 'UnnamedController';
    const handlerName = context.getHandler().name || 'UnnamedHandler';

    this.logger.log(
      JSON.stringify({
        requestId: requestId,
        controller: controllerName,
        handler: handlerName,
        body: req.body,
        queryStrings: req.query,
        headers: req.headers,
      }),
      'HttpRequestLogger',
    );

    return next.handle().pipe(
      tap((respose) =>
        this.logger.log(
          JSON.stringify({
            requestId: requestId,
            controller: controllerName,
            handler: handlerName,
            response: respose,
            processTimeMS: Date.now() - now,
          }),
          'HttpResponseLogger',
        ),
      ),
    );
  }
}
