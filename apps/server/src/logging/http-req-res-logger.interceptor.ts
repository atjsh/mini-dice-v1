import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';

/**
 * Http 요청/응답 간 주고받은 데이터를 로깅하는 인터셉터.
 */
@Injectable()
export class HttpRequestResponseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
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
