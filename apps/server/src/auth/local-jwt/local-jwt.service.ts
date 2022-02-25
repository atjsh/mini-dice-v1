import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalJwtService {}

export function getAuthorizationHeaderField(authorizationValue: string) {
  return {
    Authorization: authorizationValue,
  };
}
