import { ForbiddenException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { getRandomInteger } from '../../common/random/random-number';
import { getRandomString } from '../../common/random/random-string';
import { UserEntity } from '../../user/entity/user.entity';
import { UserRepository } from '../../user/user.repository';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';

export abstract class OauthAbstractService {
  constructor(
    protected userRepository: UserRepository,
    protected refreshTokenService: RefreshTokenService,
  ) {}

  private async setNewRefreshTokenOnCookie(
    expressResponse: FastifyReply,
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

  protected async authUserWithOauthProvider(
    provider: UserEntity['authProvider'],
    email: UserEntity['email'],
    expressResponse: FastifyReply,
    alreadyExistedRefreshToken?: string,
  ) {
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
      const existingOAuthProviderUsers = await this.userRepository.find({
        email: email,
        authProvider: provider,
      });

      const isNewUser = existingOAuthProviderUsers.length == 0;

      // 기존에 구글 계정으로 가입하지 않았다면: 기존 익명 계정에 구글 계정을 연결함
      if (isNewUser) {
        const user = await this.userRepository.partialUpdateUser(
          refreshTokenEntity.userId,
          {
            email: email,
            authProvider: provider,
          },
        );

        await this.setNewRefreshTokenOnCookie(expressResponse, user);

        return {
          isNewUser: false,
        };
      } else {
        // 기존에 구글 계정으로 가입했다면: 구글 계정으로 그냥 로그인함. 익명 계정에는 다시 접근할 수 없음.

        const [existingOAuthProviderUser] = existingOAuthProviderUsers;

        // 익명 계정의 캐시가 20,000 이상인 경우: 기존의 구글 계정에 편입시킴
        if (anonUser.cash > 20000) {
          await this.userRepository.changeUserCash(
            existingOAuthProviderUser.id,
            anonUser.cash,
            existingOAuthProviderUser.cash,
          );
        }

        await this.setNewRefreshTokenOnCookie(
          expressResponse,
          existingOAuthProviderUser,
        );

        return {
          isNewUser: false,
        };
      }
    }

    // 로그인하지 않은 유저가 구글 계정 연동 버튼을 누른 경우

    const existingUsers = await this.userRepository.find({
      email: email,
      authProvider: provider,
    });

    const isNewUser = existingUsers.length == 0;

    if (isNewUser) {
      const user = await this.userRepository.signUpNewUser({
        email,
        authProvider: provider,
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
