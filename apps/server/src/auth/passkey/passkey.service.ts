import './webauthn-webcrypto';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { v7 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/server/script/deps';
import { PasskeyEntity } from './entity/passkey.entity';
import { UserService } from '../../user/user.service';
import { RefreshTokenService } from '../local-jwt/refresh-token/refresh-token.service';

@Injectable()
export class PasskeyService {
  private readonly MAX_PASSKEYS_PER_USER = 100;

  constructor(
    @InjectRepository(PasskeyEntity)
    private passkeyRepository: Repository<PasskeyEntity>,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private credentialIdToBase64URL(credentialId: string | Uint8Array) {
    return typeof credentialId === 'string'
      ? credentialId
      : Buffer.from(credentialId).toString('base64url');
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
      throw new BadRequestException('Maximum passkey limit (100) reached');
    }

    const rpID = this.configService.get('WEBAUTHN_RP_ID');
    const rpName = this.configService.get('WEBAUTHN_RP_NAME', 'Mini Dice');

    if (!rpID) {
      throw new BadRequestException('WebAuthn is not configured');
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

    // Store challenge in cache for verification
    await this.cacheManager.set(
      `webauthn:register:${userId}`,
      options.challenge,
      300000,
    );

    return options;
  }

  async verifyRegistration(
    userId: string,
    credential: RegistrationResponseJSON,
    name?: string,
  ) {
    const expectedChallenge = await this.cacheManager.get<string>(
      `webauthn:register:${userId}`,
    );

    if (!expectedChallenge) {
      throw new BadRequestException('Challenge not found or expired');
    }

    const rpID = this.configService.get('WEBAUTHN_RP_ID');
    const origin = this.configService.get('WEBAUTHN_ORIGIN');

    if (!rpID || !origin) {
      throw new BadRequestException('WebAuthn is not configured');
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
      throw new BadRequestException('Passkey verification failed');
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException('Passkey verification failed');
    }

    const { credentialID, credentialPublicKey, counter, aaguid } =
      verification.registrationInfo;

    const passkey = this.passkeyRepository.create({
      userId,
      credentialId: this.credentialIdToBase64URL(credentialID),
      publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
      counter,
      aaguid,
      transports: credential.response.transports || [],
      deviceType: verification.registrationInfo.credentialDeviceType,
      name: name || 'Passkey',
    });

    await this.passkeyRepository.save(passkey);
    await this.cacheManager.del(`webauthn:register:${userId}`);

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

    return { success: true, passkeyId: passkey.id };
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

    const result = await this.passkeyRepository.delete({ id: passkeyId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Passkey not found');
    }

    return { success: true };
  }

  async listPasskeys(userId: string) {
    const passkeys = await this.passkeyRepository.find({
      where: { userId },
      select: ['id', 'name', 'createdAt', 'lastUsedAt', 'deviceType'],
      order: { createdAt: 'DESC' },
    });

    return passkeys;
  }

  async renamePasskey(userId: string, passkeyId: string, name: string) {
    const result = await this.passkeyRepository.update(
      { id: passkeyId, userId },
      { name },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Passkey not found');
    }

    return { success: true };
  }

  async generateAuthenticationOptions(credentialId?: string) {
    const rpID = this.configService.get('WEBAUTHN_RP_ID');

    if (!rpID) {
      throw new BadRequestException('WebAuthn is not configured');
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: credentialId
        ? [
            {
              id: credentialId,
              transports: ['internal', 'usb', 'ble', 'nfc'] as AuthenticatorTransportFuture[],
            },
          ]
        : undefined,
    });

    const challengeId = v7();
    await this.cacheManager.set(
      `webauthn:auth:${challengeId}`,
      options.challenge,
      300000,
    );

    return { ...options, challengeId };
  }

  async verifyAuthentication(
    challengeId: string,
    credential: AuthenticationResponseJSON,
    response: FastifyReply,
  ) {
    const expectedChallenge = await this.cacheManager.get<string>(
      `webauthn:auth:${challengeId}`,
    );

    if (!expectedChallenge) {
      throw new UnauthorizedException('Challenge not found or expired');
    }

    const legacyCredentialId = Buffer.from(credential.id).toString('base64url');
    const passkey = await this.passkeyRepository.findOne({
      where: [
        { credentialId: credential.id },
        { credentialId: legacyCredentialId },
      ],
    });

    if (!passkey) {
      throw new UnauthorizedException('Passkey not found');
    }

    const rpID = this.configService.get('WEBAUTHN_RP_ID');
    const origin = this.configService.get('WEBAUTHN_ORIGIN');

    if (!rpID || !origin) {
      throw new BadRequestException('WebAuthn is not configured');
    }

    let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: false,
        authenticator: {
          credentialID: isoBase64URL.toBuffer(credential.id) as any,
          credentialPublicKey: isoBase64URL.toBuffer(passkey.publicKey) as any,
          counter: passkey.counter,
        },
      });
    } catch {
      throw new UnauthorizedException('Authentication failed');
    }

    if (!verification.verified) {
      throw new UnauthorizedException('Authentication failed');
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

    await this.cacheManager.del(`webauthn:auth:${challengeId}`);

    const user = await this.userService.findUserWithCache(passkey.userId);
    return { success: true, isSignupFinished: user.signupCompleted };
  }
}
