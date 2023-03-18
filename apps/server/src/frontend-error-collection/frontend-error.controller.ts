import { Body, Controller, Post } from '@nestjs/common';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import type { FrontendErrorService } from './frontend-error.service';

@Controller('frontend-error')
export class FrontendErrorController {
  constructor(private fronterrorService: FrontendErrorService) {}

  @JwtAuth()
  @Post()
  async insert(
    @Body() errorBody: { error: string },
    @UserJwt() userJwt: UserJwtDto,
  ) {
    await this.fronterrorService.insert(errorBody.error, userJwt.userId);
  }
}
