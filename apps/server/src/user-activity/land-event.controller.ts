import { Controller, Get } from '@nestjs/common';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { TimeZone } from '../common/get-timezone';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { UserActivityService } from './user-activity.service';

@Controller('land-events')
export class LandEventController {
  constructor(private landEventService: UserActivityService) {}

  @JwtAuth()
  @Get('')
  async getLandEvents(
    @UserJwt() userJwt: UserJwtDto,
    @TimeZone() timeZone: string,
  ) {
    return this.landEventService.renderRecentLandEvent(
      {
        pageNo: 1,
        pageSize: 50,
        userId: userJwt.userId,
      },
      timeZone,
    );
  }
}
