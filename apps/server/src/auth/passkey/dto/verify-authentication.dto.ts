import { IsObject, IsString } from 'class-validator';

export class VerifyAuthenticationDto {
  @IsString()
  challengeId: string;

  @IsObject()
  credential: any; // AuthenticationResponseJSON
}
