import { ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { getRandomInteger } from '../../common/random/random-number';
import { getRandomString } from '../../common/random/random-string';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';
import { RefreshTokenEntity } from '../local-jwt/refresh-token/entity/refresh-token.entity';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';

export abstract class OauthAbstractService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    protected userService: UserService,
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

  private async signUpNewUser(
    expressResponse: FastifyReply,
    email: string,
    provider: string,
  ) {
    const user = await this.userService.signUpNewUser({
      email,
      authProvider: provider,
      username: `유저${getRandomInteger(
        10000000000,
        99999999999,
      )}${getRandomString(4)}`,
      signupCompleted: false,
    });

    await this.setNewRefreshTokenOnCookie(expressResponse, user);

    return {
      isSignupFinished: user.signupCompleted,
    };
  }

  private async signInExistingUser(
    expressResponse: FastifyReply,
    user: UserEntity,
  ) {
    await this.setNewRefreshTokenOnCookie(expressResponse, user);

    return {
      isSignupFinished: user.signupCompleted,
    };
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
      let refreshTokenEntity: RefreshTokenEntity;
      let anonUser: UserEntity;
      try {
        refreshTokenEntity =
          await this.refreshTokenService.findRefreshTokenOrRevokeAndThrow(
            expressResponse,
            alreadyExistedRefreshToken,
          );
        anonUser = await this.userService.findUserWithCache(
          refreshTokenEntity.userId,
        );

        if (anonUser.email != null || anonUser.isTerminated) {
          throw new ForbiddenException('FYX');
        }
      } catch (e) {
        // 익명 유저가 아닌 일반 유저이거나, refreshToken에 대응되는 유저가 존재하지 않거나, 유저가 삭제되었을 경우
        // 기존 계정에 로그인을 시도하거나 새로 가입함
        const existingUsers = await this.userRepository.find({
          email: email,
          authProvider: provider,
          isTerminated: false,
        });

        if (existingUsers.length == 0) {
          return this.signUpNewUser(expressResponse, email, provider);
        }

        return this.signInExistingUser(expressResponse, existingUsers[0]);
      }
      // 정상적인 익명 유저로 확인된 경우

      // 기존에 구글 계정으로 가입했는지 체크
      const existingOAuthProviderUsers = await this.userRepository.find({
        email: email,
        authProvider: provider,
      });

      const isNewUser = existingOAuthProviderUsers.length == 0;

      // 기존에 구글 계정으로 가입하지 않았다면: 익명 계정에 구글 계정을 연결함
      if (isNewUser) {
        const user = await this.userService.partialUpdateUser(
          refreshTokenEntity.userId,
          {
            email: email,
            authProvider: provider,
            isTerminated: false,
          },
        );

        await this.refreshTokenService.deleteRefreshToken(
          expressResponse,
          alreadyExistedRefreshToken,
        );

        await this.setNewRefreshTokenOnCookie(expressResponse, user);

        return {
          isSignupFinished: user.signupCompleted,
        };
      } else {
        // 기존에 구글 계정으로 가입했다면: 구글 계정으로 그냥 로그인함. 익명 계정에는 다시 접근할 수 없음.

        const [existingOAuthProviderUser] = existingOAuthProviderUsers;

        // 익명 계정의 캐시가 20,000 이상인 경우: 기존의 구글 계정에 편입시킴
        if (anonUser.cash > 20000 || anonUser.stockId) {
          await this.userService.changeUserCash(
            existingOAuthProviderUser.id,
            anonUser.cash,
            existingOAuthProviderUser.cash +
              BigInt(anonUser.stockAmount) * BigInt(anonUser.stockPrice),
          );
        }

        await this.setNewRefreshTokenOnCookie(
          expressResponse,
          existingOAuthProviderUser,
        );

        await this.userService.terminateUser(anonUser.id);

        return {
          isSignupFinished: existingOAuthProviderUser.signupCompleted,
        };
      }
    }

    // 로그인하지 않은 유저가 구글 계정 연동 버튼을 누른 경우

    const existingUsers = await this.userRepository.find({
      email: email,
      authProvider: provider,
      isTerminated: false,
    });

    if (existingUsers.length == 0) {
      return this.signUpNewUser(expressResponse, email, provider);
    }

    return this.signInExistingUser(expressResponse, existingUsers[0]);
  }
}
