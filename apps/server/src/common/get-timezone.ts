import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error('Time zones are not available in this environment');
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (ex) {
    return false;
  }
}

const REQUEST_HEADER_TIMEZONE_KEY = 'TimeZone';

export const TimeZone = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const timeZoneHeader = request.headers[REQUEST_HEADER_TIMEZONE_KEY];

    console.log(timeZoneHeader);

    if (typeof timeZoneHeader == 'string' && isValidTimeZone(timeZoneHeader)) {
      console.log(timeZoneHeader);

      return timeZoneHeader;
    }

    return 'Asia/Seoul';
  },
);
