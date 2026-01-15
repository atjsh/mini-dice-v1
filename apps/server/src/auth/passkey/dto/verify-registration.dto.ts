import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class VerifyRegistrationDto {
  @IsObject()
  credential: any; // RegistrationResponseJSON

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
