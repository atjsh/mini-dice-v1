import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

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

const REQUEST_HEADER_TIMEZONE_KEY = 'timezone';

export const TimeZone = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const timeZoneHeader = request.headers[REQUEST_HEADER_TIMEZONE_KEY];

    if (typeof timeZoneHeader == 'string' && isValidTimeZone(timeZoneHeader)) {
      return timeZoneHeader;
    }

    return 'Asia/Seoul';
  },
);
