import { ForbiddenException, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RefreshTokenService } from '../auth/local-jwt/refresh-token/refresh-token.service';
import { HCaptchaService } from '../h-captcha/h-captcha.service';
import { UserRepository } from '../user/user.repository';
import { TemporarySignUpDto } from './temp-signup.controller';

@Injectable()
export class TempSignupService {
  constructor(
    private hCaptchaService: HCaptchaService,
    private userRepository: UserRepository,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async createUser(
    { hCaptchaSuccessToken, username, countryCode3 }: TemporarySignUpDto,
    expressResponse: FastifyReply,
  ) {
    const response = await this.hCaptchaService.verify(hCaptchaSuccessToken);

    if (!response) {
      throw new ForbiddenException('hcaptcha fail');
    }
    const user = await this.userRepository.signUpNewUser({
      username,
      authProvider: 'hcaptcha',
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
