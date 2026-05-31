import { IsString, MaxLength } from 'class-validator';

export class RenamePasskeyDto {
  @IsString()
  @MaxLength(100)
  name: string;
}
