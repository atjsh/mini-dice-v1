import { OmitType } from '@nestjs/swagger';
import { RefreshTokenEntity } from '../entity/refresh-token.entity';

export class CreateRefreshTokenDto extends OmitType(RefreshTokenEntity, [
  'value',
]) {}
