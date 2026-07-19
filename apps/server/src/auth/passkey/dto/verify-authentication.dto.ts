import { IsObject } from 'class-validator';

export class VerifyAuthenticationDto {
  @IsObject()
  credential: any; // AuthenticationResponseJSON
}
