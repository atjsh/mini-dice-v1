import { ForbiddenException, Injectable } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { RefreshTokenService } from '../auth/local-jwt/refresh-token/refresh-token.service';
import { TurnstileService } from '../turnstile/turnstile.service';
import { UserService } from '../user/user.service';
import type { TemporarySignUpDto } from './temp-signup.controller';

@Injectable()
export class TempSignupService {
  constructor(
    private turnstileService: TurnstileService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async createUser(
    { turnstileToken, username, countryCode3 }: TemporarySignUpDto,
    expressResponse: FastifyReply,
  ) {
    const response = await this.turnstileService.verify(turnstileToken);

    if (!response) {
      throw new ForbiddenException(
        '사람입니다 확인에 실패했습니다. 다시 시도해 주세요.',
      );
    }
    const user = await this.userService.signUpNewUser({
      username,
      authProvider: 'turnstile',
      signupCompleted: true,
      countryCode3,
    });

    const refreshToken = await this.refreshTokenService.createNewRefreshToken({
      userId: user.id,
    });

    this.refreshTokenService.setRefreshTokenOnCookie(
      expressResponse,
      refreshToken,
    );

    return true;
  }
}
