import { getRandomInteger } from '@apps/server/common/random/random-number';
import { getRandomString } from '@apps/server/common/random/random-string';
import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { GoogleApiService } from './google-api.service';
import { Response } from 'Express';
import { UserRepository } from '@apps/server/user/user.repository';
import { UserEntity } from '@apps/server/user/entity/user.entity';

@Injectable()
export class GoogleOAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  private async setNewRefreshTokenOnCookie(
    expressResponse: Response,
    user: UserEntity,
  ) {
    const refreshToken = await this.refreshTokenService.createNewRefreshToken({
      userId: user.id,
    });

    this.refreshTokenService.setRefreshTokenOnCookie(
      expressResponse,
      refreshToken,
    );
  }

  async authUserWithGoogleOauthCode(
    expressResponse: Response,
    authCode: string,
    alreadyExistedRefreshToken?: string,
  ): Promise<{ isNewUser: boolean }> {
    const { email } = await this.googleApiService.getGoogleUser(authCode);

    // 익명 유저가 구글 계정 연동 버튼을 누른 경우
    if (alreadyExistedRefreshToken != undefined) {
      // 기존에 구글 계정으로 가입했는지 체크
      const existingUsers = await this.userRepository.find({
        email: email,
        authProvider: 'google',
      });

      const isNewUser = existingUsers.length == 0;

      // 기존에 구글 계정으로 가입하지 않았다면: 기존 익명 계정에 구글 계정을 연결함
      if (isNewUser) {
        const refreshTokenEntity =
          await this.refreshTokenService.findRefreshToken(
            alreadyExistedRefreshToken,
          );

        const user = await this.userRepository.partialUpdateUser(
          refreshTokenEntity.userId,
          {
            email: email,
            authProvider: 'google',
          },
        );

        await this.setNewRefreshTokenOnCookie(expressResponse, user);

        return {
          isNewUser: false,
        };
      } else {
        // 기존에 구글 계정으로 가입했다면: 구글 계정으로 그냥 로그인함. 익명 계정에는 다시 접근할 수 없음.

        const [user] = existingUsers;
        await this.setNewRefreshTokenOnCookie(expressResponse, user);

        return {
          isNewUser: false,
        };
      }
    }

    // 일반 유저가 구글 계정 연동 버튼을 누른 경우

    const existingUsers = await this.userRepository.find({
      email: email,
      authProvider: 'google',
    });

    const isNewUser = existingUsers.length == 0;

    if (isNewUser) {
      const user = await this.userRepository.signUpNewUser({
        email,
        authProvider: 'google',
        username: `유저${getRandomInteger(
          10000000000,
          99999999999,
        )}${getRandomString(4)}`,
      });

      await this.setNewRefreshTokenOnCookie(expressResponse, user);

      return {
        isNewUser: true,
      };
    }

    const [user] = existingUsers;
    await this.setNewRefreshTokenOnCookie(expressResponse, user);

    return {
      isNewUser: false,
    };
  }
}
