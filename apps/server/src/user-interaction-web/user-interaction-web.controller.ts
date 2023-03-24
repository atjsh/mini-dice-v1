import { Body, Controller, Post } from '@nestjs/common';
import { getSkillRouteFromPath } from '@packages/scenario-routing';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { TimeZone } from '../common/get-timezone';
import type { UserInteractionOutputDto } from '../dice-toss/interface';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { UserInteractionWebService } from './user-interaction-web.service';

class UserInteractionDto {
  callingSkillRoute: string;
  callingSkillParam: Record<string, string>;
}

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
