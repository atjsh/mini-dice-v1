import type { RegistrationResponseJSON } from '@simplewebauthn/server';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class VerifyRegistrationDto {
  @IsObject()
  credential: RegistrationResponseJSON;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
