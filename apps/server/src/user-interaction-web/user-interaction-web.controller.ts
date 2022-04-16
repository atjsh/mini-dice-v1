import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getSkillRouteFromPath } from '@packages/scenario-routing';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { TimeZone } from '../common/get-timezone';
import { UserInteractionOutputDto } from '../dice-toss/interface';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { UserInteractionWebService } from './user-interaction-web.service';

class UserInteractionDto {
  callingSkillRoute: string;
  callingSkillParam: Record<string, string>;
}

@ApiTags('유저 인터렉션 전송')
@JwtAuth()
@Controller('user-interaction-web')
export class UserInteractionWebController {
  constructor(
    private readonly userInteractionWebService: UserInteractionWebService,
  ) {}

  @Post('')
  async makeUserInteractionAndGetWebMessageResponse(
    @UserJwt() userJwt: UserJwtDto,
    @Body() userInteraction: UserInteractionDto,
    @TimeZone() timeZone: string,
  ): Promise<UserInteractionOutputDto> {
    return await this.userInteractionWebService.callSkillFromWebUserInteraction(
      getSkillRouteFromPath(userInteraction.callingSkillRoute),
      userInteraction.callingSkillParam,
      userJwt,
      timeZone,
    );
  }
}
