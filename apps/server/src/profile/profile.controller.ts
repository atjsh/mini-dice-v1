import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CompleteSignupUserDto,
  UpdateUserDto,
  UserIdType,
} from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { USER_PROFILE_APIS } from '../common';
import { UserRepository } from '../user/user.repository';
import { JwtAuth, UserJwt } from './decorators/user.decorator';
import { PublicProfileService } from './profile.service';

class PageDto {
  limit = 10;
  page = 1;
}

@ApiTags(USER_PROFILE_APIS)
@Controller('profile')
export class PublicProfileController {
  constructor(
    private readonly profileService: PublicProfileService,
    private userRepository: UserRepository,
  ) {}

  @JwtAuth()
  @Get('me')
  async getProfile(@UserJwt() userJwt: UserJwtDto) {
    return await this.profileService.getUser(userJwt, true);
  }

  @JwtAuth()
  @Patch('me')
  updateUserById(@UserJwt() userJwt: UserJwtDto, @Body() user: UpdateUserDto) {
    return this.userRepository.partialUpdateUser(userJwt.userId, user);
  }

  @Get('others')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOthersProfiles(@Query() { limit, page }: PageDto) {
    return await this.profileService.getUsers(limit, page);
  }

  @JwtAuth()
  @Get('others/:otherUserId')
  async getOthersProfile(@Param('otherUserId') otherUserId: UserIdType) {
    return await this.profileService.getUser({ userId: otherUserId }, false);
  }

  @JwtAuth()
  @Patch('complete-signup')
  completeSignup(
    @UserJwt() userJwt: UserJwtDto,
    @Body() completeSignupUserDto: CompleteSignupUserDto,
  ) {
    return this.userRepository.completeSignup(
      userJwt.userId,
      completeSignupUserDto,
    );
  }

  @JwtAuth()
  @Delete('')
  terminateUser(@UserJwt() userJwt: UserJwtDto) {
    return this.userRepository.terminateUser(userJwt.userId);
  }
}
