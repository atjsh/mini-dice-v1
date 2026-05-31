import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { UpdateUserPreferenceDto } from '@packages/shared-types';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { UserPreferenceService } from './user-preference.service';

@Controller('user-preference')
export class UserPreferenceController {
  constructor(
    private readonly userPreferenceService: UserPreferenceService,
  ) {}

  @JwtAuth()
  @Get('me')
  async getUserPreference(@UserJwt() userJwt: UserJwtDto) {
    return await this.userPreferenceService.getUserPreference(userJwt.userId);
  }

  @JwtAuth()
  @Patch('me')
  async updateUserPreference(
    @UserJwt() userJwt: UserJwtDto,
    @Body() updateDto: UpdateUserPreferenceDto,
  ) {
    return await this.userPreferenceService.updateUserPreference(
      userJwt.userId,
      updateDto,
    );
  }
}
