import { BadRequestException } from '@nestjs/common';

export function getAccessTokenFromAuthorizationHeader(
  authorization: string,
): string {
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new BadRequestException('Invalid authorization header');
  }
  return parts[1];
}
