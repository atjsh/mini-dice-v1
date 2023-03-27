import {
  type ArgumentsHost,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Catch, Injectable, Logger } from '@nestjs/common';

/**
 * HttpException 에러들을 수집하여
 * - 로그에 남기고
 * - Http 응답으로 에러 정보를 리턴함.
 */
@Injectable()
@Catch(HttpException)
export class HttpExceptionLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = exception.getStatus();
    const errorResponseBody = exception.getResponse();

    this.logger.error(
      JSON.stringify({
        statusCode: statusCode,
        errorResponseBody: errorResponseBody,
        stackTrace: exception.stack,
      }),
      exception.stack,
      HttpExceptionLoggingFilter.name,
    );

    response.status(statusCode).send(errorResponseBody);
  }
}
