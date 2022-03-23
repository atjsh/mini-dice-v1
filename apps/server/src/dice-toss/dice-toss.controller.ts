import { Controller, Post, Headers } from '@nestjs/common';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { UserJwt } from '../profile/decorators/user.decorator';
import { DiceTossService } from './dice-toss.service';
import { DiceTossOutputDto } from './interface';

@Controller('dice-toss')
export class DiceTossController {
  constructor(private diceTossService: DiceTossService) {}

  @Post('')
  async tossDiceAndGetWebMessageResponse(
    @Headers() headers: Record<string, string>,
    @UserJwt() userJwt: UserJwtDto,
  ): Promise<DiceTossOutputDto> {
    const authorizationValue = headers['authorization'];
    return await this.diceTossService.tossDiceAndGetWebMessageResponse(
      userJwt,
      authorizationValue,
    );
  }
}
