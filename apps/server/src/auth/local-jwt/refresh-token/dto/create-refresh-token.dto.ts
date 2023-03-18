import { RefreshTokenEntity } from '../entity/refresh-token.entity';

export type CreateRefreshTokenDto = Omit<RefreshTokenEntity, 'value'>
