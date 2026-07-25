import type { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { IsObject } from 'class-validator';

export class VerifyAuthenticationDto {
  @IsObject()
  credential: AuthenticationResponseJSON;
}
