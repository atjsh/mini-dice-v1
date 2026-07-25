import './webauthn-webcrypto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
  type PublicKeyCredentialCreationOptionsJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import {
  decodeClientDataJSON,
  isoBase64URL,
} from '@simplewebauthn/server/helpers';
import type {
  PasskeyListItemDto,
  PasskeyRegistrationResultDto,
} from '@packages/shared-types';
import { PasskeyEntity } from './entity/passkey.entity';
import { UserService } from '../../user/user.service';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';
import { PasskeyChallengeService } from './passkey-challenge.service';

@Injectable()
export class PasskeyService {
  private readonly MAX_PASSKEYS_PER_USER = 100;

  constructor(
    @InjectRepository(PasskeyEntity)
    private passkeyRepository: Repository<PasskeyEntity>,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
    private passkeyChallengeService: PasskeyChallengeService,
  ) {}

  private extractExpectedChallenge(
    credential: RegistrationResponseJSON | AuthenticationResponseJSON,
  ): string | undefined {
    try {
      const clientDataJSON = credential?.response?.clientDataJSON;
      if (typeof clientDataJSON !== 'string') {
        return undefined;
      }

      const { challenge } = decodeClientDataJSON(clientDataJSON);
      return typeof challenge === 'string' && challenge.length > 0
        ? challenge
        : undefined;
    } catch {
      return undefined;
    }
  }

  async generateRegistrationOptions(
    userId: string,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const user = await this.userService.findUserWithCache(userId);
    const existingPasskeys = await this.passkeyRepository.find({
      where: { userId },
    });

    // Enforce 100 passkey limit
    if (existingPasskeys.length >= this.MAX_PASSKEYS_PER_USER) {
      throw new BadRequestException(
        '패스키는 최대 100개까지 등록할 수 있습니다.',
      );
    }

    const rpID = this.configService.get<string>('WEBAUTHN_RP_ID');
    const rpName = this.configService.get<string>(
      'WEBAUTHN_RP_NAME',
      'Mini Dice',
    );

    if (!rpID) {
      throw new BadRequestException('패스키 서버 설정이 완료되지 않았습니다.');
    }

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(Buffer.from(userId)),
      userName: user.username,
      excludeCredentials: existingPasskeys.map((p) => ({
        id: p.credentialId,
        transports: p.transports as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: 'required',
        requireResidentKey: true,
        userVerification: 'preferred',
      },
    });

    await this.passkeyChallengeService.storeRegistrationChallenge(
      options.challenge,
      userId,
    );

    return options;
  }

  async verifyRegistration(
    userId: string,
    credential: RegistrationResponseJSON,
    name?: string,
  ): Promise<PasskeyRegistrationResultDto> {
    const rpID = this.configService.get<string>('WEBAUTHN_RP_ID');
    const origin = this.configService.get<string>('WEBAUTHN_ORIGIN');

    if (!rpID || !origin) {
      throw new BadRequestException('패스키 서버 설정이 완료되지 않았습니다.');
    }

    const expectedChallenge = this.extractExpectedChallenge(credential);
    if (!expectedChallenge) {
      throw new BadRequestException(
        '패스키 확인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    const challengeConsumed =
      await this.passkeyChallengeService.consumeRegistrationChallenge(
        expectedChallenge,
        userId,
      );
    if (!challengeConsumed) {
      throw new BadRequestException(
        '패스키 요청이 만료되었습니다. 다시 시도해 주세요.',
      );
    }

    let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
    try {
      verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch {
      throw new BadRequestException(
        '패스키 확인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException(
        '패스키 확인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    const {
      credential: verifiedCredential,
      credentialDeviceType,
      aaguid,
    } = verification.registrationInfo;
    const persistedAaguid = aaguid || null;
    const passkeyName = name?.trim() || 'Passkey';

    const passkey = this.passkeyRepository.create({
      userId,
      credentialId: verifiedCredential.id,
      publicKey: Buffer.from(verifiedCredential.publicKey).toString(
        'base64url',
      ),
      counter: verifiedCredential.counter,
      aaguid: persistedAaguid,
      transports: credential.response.transports || [],
      deviceType: credentialDeviceType,
      name: passkeyName,
    });

    await this.passkeyRepository.save(passkey);

    // If this is the first passkey for a captcha-based user, finalize signup.
    const user = await this.userService.findUserWithCache(userId);
    if (
      ['hcaptcha', 'turnstile'].includes(user.authProvider) &&
      !user.signupCompleted
    ) {
      await this.userService.partialUpdateUser(userId, {
        signupCompleted: true,
      });
    }

    return {
      success: true,
      passkeyId: passkey.id,
      name: passkey.name,
      aaguid: passkey.aaguid,
    };
  }

  async deletePasskey(userId: string, passkeyId: string) {
    const user = await this.userService.findUserWithCache(userId);
    const passkeyCount = await this.passkeyRepository.count({
      where: { userId },
    });
    const hasLinkedAccount = user.email != null;

    // Prevent deletion if this is the only passkey and no linked login account
    if (passkeyCount === 1 && !hasLinkedAccount) {
      throw new BadRequestException(
        '연결된 Google 계정 없이 마지막 패스키를 삭제할 수 없습니다.',
      );
    }

    const result = await this.passkeyRepository.delete({
      id: passkeyId,
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('패스키를 찾을 수 없습니다.');
    }

    return { success: true };
  }

  async listPasskeys(userId: string): Promise<PasskeyListItemDto[]> {
    const passkeys = await this.passkeyRepository.find({
      where: { userId },
      select: ['id', 'name', 'aaguid', 'createdAt', 'lastUsedAt', 'deviceType'],
      order: { createdAt: 'DESC' },
    });

    return passkeys.map((passkey) => ({
      id: passkey.id,
      name: passkey.name,
      aaguid: passkey.aaguid,
      deviceType: passkey.deviceType,
      createdAt: passkey.createdAt,
      lastUsedAt: passkey.lastUsedAt,
    }));
  }

  async renamePasskey(userId: string, passkeyId: string, name: string) {
    const result = await this.passkeyRepository.update(
      { id: passkeyId, userId },
      { name },
    );

    if (result.affected === 0) {
      throw new NotFoundException('패스키를 찾을 수 없습니다.');
    }

    return { success: true };
  }

  async generateAuthenticationOptions(credentialId?: string) {
    const rpID = this.configService.get<string>('WEBAUTHN_RP_ID');

    if (!rpID) {
      throw new BadRequestException('패스키 서버 설정이 완료되지 않았습니다.');
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: credentialId
        ? [
            {
              id: credentialId,
              transports: [
                'internal',
                'usb',
                'ble',
                'nfc',
              ] as AuthenticatorTransportFuture[],
            },
          ]
        : undefined,
    });

    await this.passkeyChallengeService.storeAuthenticationChallenge(
      options.challenge,
    );

    return options;
  }

  async verifyAuthentication(
    credential: AuthenticationResponseJSON,
    response: FastifyReply,
  ) {
    const rpID = this.configService.get<string>('WEBAUTHN_RP_ID');
    const origin = this.configService.get<string>('WEBAUTHN_ORIGIN');

    if (!rpID || !origin) {
      throw new BadRequestException('패스키 서버 설정이 완료되지 않았습니다.');
    }

    const expectedChallenge = this.extractExpectedChallenge(credential);
    if (!expectedChallenge) {
      throw new UnauthorizedException(
        '패스키 로그인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    const challengeConsumed =
      await this.passkeyChallengeService.consumeAuthenticationChallenge(
        expectedChallenge,
      );
    if (!challengeConsumed) {
      throw new UnauthorizedException(
        '패스키 요청이 만료되었습니다. 다시 시도해 주세요.',
      );
    }

    if (typeof credential.id !== 'string') {
      throw new UnauthorizedException(
        '패스키 로그인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    const legacyCredentialId = Buffer.from(credential.id).toString('base64url');
    const passkey = await this.passkeyRepository.findOne({
      where: [
        { credentialId: credential.id },
        { credentialId: legacyCredentialId },
      ],
    });

    if (!passkey) {
      throw new UnauthorizedException('패스키를 찾을 수 없습니다.');
    }

    let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
        credential: {
          id: credential.id,
          publicKey: isoBase64URL.toBuffer(passkey.publicKey),
          counter: passkey.counter,
          transports: passkey.transports as
            AuthenticatorTransportFuture[] | undefined,
        },
      });
    } catch {
      throw new UnauthorizedException(
        '패스키 로그인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    if (!verification.verified) {
      throw new UnauthorizedException(
        '패스키 로그인에 실패했습니다. 다시 시도해 주세요.',
      );
    }

    // Update counter and lastUsedAt
    await this.passkeyRepository.update(passkey.id, {
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date(),
    });

    // Issue refresh token
    const refreshToken = await this.refreshTokenService.createNewRefreshToken({
      userId: passkey.userId,
    });
    this.refreshTokenService.setRefreshTokenOnCookie(response, refreshToken);

    const user = await this.userService.findUserWithCache(passkey.userId);
    return { success: true, isSignupFinished: user.signupCompleted };
  }
}
