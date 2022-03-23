import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { USER_PROFILE_APIS } from '../common';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { RecentSkillLogsService } from './recent-skill-logs.service';

@ApiTags(USER_PROFILE_APIS)
@Controller('recent-skill-logs')
export class RecentSkillLogsController {
  constructor(
    private readonly recentSkillLogsService: RecentSkillLogsService,
  ) {}

  @JwtAuth()
  @Get('')
  async getRecentSkillLogsWeb(
    @UserJwt() userJwt: UserJwtDto,
    @Query('limit') limit: number,
  ) {
    return this.recentSkillLogsService.getRecentSkillLogsWeb(
      userJwt.userId,
      limit,
    );
  }

  @JwtAuth()
  @Get('latest')
  async getLatestSkill(@UserJwt() userJwt: UserJwtDto) {
    return this.recentSkillLogsService.getLatestSkill(userJwt.userId);
  }
}
