import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type {
  CompleteSignupUserDto,
  UpdateUserDto,
  UserVo,
} from '@packages/shared-types';
import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import type { UserService } from '../user/user.service';
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

@Controller('profile')
export class PublicProfileController {
  constructor(
    private readonly profileService: PublicProfileService,
    private userService: UserService,
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

    return this.userService.partialUpdateUser(userJwt.userId, {
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
    return this.userService.completeSignup(
      userJwt.userId,
      completeSignupUserDto,
    );
  }

  @JwtAuth()
  @Delete('')
  terminateUser(@UserJwt() userJwt: UserJwtDto) {
    return this.userService.terminateUser(userJwt.userId);
  }
}
