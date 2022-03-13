import { ForbiddenException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RefreshTokenService } from '../auth/local-jwt/refresh-token/refresh-token.service';
import { HCaptchaService } from '../h-captcha/h-captcha.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TempSignupService {
  constructor(
    private hCaptchaService: HCaptchaService,
    private userRepository: UserRepository,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async createUser(
    hCaptchaResponse: string,
    username: string,
    expressResponse: Response,
  ) {
    const response = await this.hCaptchaService.verify(hCaptchaResponse);

    if (!response) {
      throw new ForbiddenException('hcaptcha fail');
    }
    const user = await this.userRepository.signUpNewUser({
      username,
      authProvider: 'hcaptcha',
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
