import { getRandomInteger } from '@apps/server/common/random/random-number';
import { getRandomString } from '@apps/server/common/random/random-string';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { GoogleApiService } from './google-api.service';
import { Response } from 'express';
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
      // 익명 유저가 맞는지 체크
      const refreshTokenEntity =
        await this.refreshTokenService.findRefreshToken(
          alreadyExistedRefreshToken,
        );

      const anonUser = await this.userRepository.findOneOrFail(
        refreshTokenEntity.userId,
      );

      if (anonUser.email != null) {
        throw new ForbiddenException('이미 연동이 완료된 유저입니다.');
      }

      // 기존에 구글 계정으로 가입했는지 체크
      const existingGoogleProviderUsers = await this.userRepository.find({
        email: email,
        authProvider: 'google',
      });

      const isNewUser = existingGoogleProviderUsers.length == 0;

      // 기존에 구글 계정으로 가입하지 않았다면: 기존 익명 계정에 구글 계정을 연결함
      if (isNewUser) {
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

        const [existingGoogleProviderUser] = existingGoogleProviderUsers;

        // 익명 계정의 캐시가 20,000 이상인 경우: 기존의 구글 계정에 편입시킴
        if (anonUser.cash > 20000) {
          await this.userRepository.changeUserCash(
            existingGoogleProviderUser.id,
            existingGoogleProviderUser.cash,
            anonUser.cash,
          );
        }

        await this.setNewRefreshTokenOnCookie(
          expressResponse,
          existingGoogleProviderUser,
        );

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
