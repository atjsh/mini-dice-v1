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
  UserVo,
} from '@packages/shared-types';
import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { USER_PROFILE_APIS } from '../common';
import { UserRepository } from '../user/user.repository';
import { JwtAuth, UserJwt } from './decorators/user.decorator';
import { PublicProfileService } from './profile.service';

class PageDto {
  @Type(() => Number)
  @Min(10)
  @Max(50)
  limit = 50;

  @Type(() => Number)
  @Min(1)
  @Max(10)
  page = 1;

  @Type(() => Date)
  updatedAfter?: Date;
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
    return await this.profileService.getUser(userJwt);
  }

  @JwtAuth()
  @Patch('me')
  updateUserById(@UserJwt() userJwt: UserJwtDto, @Body() user: UpdateUserDto) {
    if ((user as UserVo).cash) {
      return {
        error: '치트는 금지됩니다. 당신의 시도는 로그에 남습니다.',
      };
    }

    return this.userRepository.partialUpdateUser(userJwt.userId, {
      username: user.username,
      countryCode3: user.countryCode3,
    });
  }

  @Get('others')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOthersProfiles(@Query() { limit, page, updatedAfter }: PageDto) {
    return await this.profileService.getUsers(limit, page, updatedAfter);
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
