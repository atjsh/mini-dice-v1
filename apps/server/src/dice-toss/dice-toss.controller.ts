import { Controller, Post } from '@nestjs/common';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { TimeZone } from '../common/get-timezone';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { DiceTossService } from './dice-toss.service';
import type { DiceTossOutputDto } from './interface';

@Controller('dice-toss')
@JwtAuth()
export class DiceTossController {
  constructor(private diceTossService: DiceTossService) {}

  @Post('')
  async tossDiceAndGetWebMessageResponse(
    @UserJwt() userJwt: UserJwtDto,
    @TimeZone() timeZone: string,
  ): Promise<DiceTossOutputDto> {
    return await this.diceTossService.tossDiceAndGetWebMessageResponse(
      userJwt,
      timeZone,
    );
  }
}
