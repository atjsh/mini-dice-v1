import { Controller, Post } from '@nestjs/common';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { DiceTossService } from './dice-toss.service';
import { DiceTossOutputDto } from './interface';

@Controller('dice-toss')
@JwtAuth()
export class DiceTossController {
  constructor(private diceTossService: DiceTossService) {}

  @Post('')
  async tossDiceAndGetWebMessageResponse(
    @UserJwt() userJwt: UserJwtDto,
  ): Promise<DiceTossOutputDto> {
    return await this.diceTossService.tossDiceAndGetWebMessageResponse(userJwt);
  }
}
