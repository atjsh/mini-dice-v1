import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerateRegistrationOptionsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
