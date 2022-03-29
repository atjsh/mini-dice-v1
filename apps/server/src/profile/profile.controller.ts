import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompleteSignupUserDto, UpdateUserDto } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { USER_PROFILE_APIS } from '../common';
import { UserRepository } from '../user/user.repository';
import { JwtAuth, UserJwt } from './decorators/user.decorator';
import { ProfileService } from './profile.service';

@ApiTags(USER_PROFILE_APIS)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
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
    return this.userRepository.partialUpdateUser(userJwt.userId, user);
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
