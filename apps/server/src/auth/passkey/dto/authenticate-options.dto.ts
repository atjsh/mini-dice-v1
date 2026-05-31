import { IsOptional, IsString } from 'class-validator';

export class GenerateAuthenticationOptionsDto {
  @IsOptional()
  @IsString()
  credentialId?: string;
}
