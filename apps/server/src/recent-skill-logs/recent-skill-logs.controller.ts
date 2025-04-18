import { Controller, Get, Query } from '@nestjs/common';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { TimeZone } from '../common/get-timezone';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { RecentSkillLogsService } from './recent-skill-logs.service';

@Controller('recent-skill-logs')
export class RecentSkillLogsController {
  constructor(
    private readonly recentSkillLogsService: RecentSkillLogsService,
  ) {}

  @JwtAuth()
  @Get('')
  async getRecentSkillLogsWeb(
    @UserJwt() userJwt: UserJwtDto,
    @TimeZone() timeZone: string,
    @Query('limit') limit: number,
  ) {
    return this.recentSkillLogsService.getRecentSkillLogsWeb(
      userJwt.userId,
      limit,
      timeZone,
    );
  }
}
