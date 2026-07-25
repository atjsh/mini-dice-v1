import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { Repository } from 'typeorm';
import {
  PasskeyChallengeEntity,
  type PasskeyChallengeType,
} from './entity/passkey-challenge.entity';

export const PASSKEY_CHALLENGE_TTL_MS = 5 * 60 * 1000;

export function digestPasskeyChallenge(challenge: string): string {
  return createHash('sha256').update(challenge, 'utf8').digest('base64url');
}

@Injectable()
export class PasskeyChallengeService {
  constructor(
    @InjectRepository(PasskeyChallengeEntity)
    private readonly challengeRepository: Repository<PasskeyChallengeEntity>,
  ) {}

  async storeRegistrationChallenge(
    challenge: string,
    userId: string,
  ): Promise<void> {
    await this.storeChallenge(challenge, 'registration', userId);
  }

  async storeAuthenticationChallenge(challenge: string): Promise<void> {
    await this.storeChallenge(challenge, 'authentication', null);
  }

  async consumeRegistrationChallenge(
    challenge: string,
    userId: string,
  ): Promise<boolean> {
    return this.consumeChallenge(challenge, 'registration', userId);
  }

  async consumeAuthenticationChallenge(challenge: string): Promise<boolean> {
    return this.consumeChallenge(challenge, 'authentication', null);
  }

  private async storeChallenge(
    challenge: string,
    type: PasskeyChallengeType,
    userId: string | null,
  ): Promise<void> {
    await this.deleteExpiredChallenges();

    await this.challengeRepository.insert({
      digest: digestPasskeyChallenge(challenge),
      type,
      userId,
      expiresAt: new Date(Date.now() + PASSKEY_CHALLENGE_TTL_MS),
    });
  }

  private async deleteExpiredChallenges(): Promise<void> {
    await this.challengeRepository
      .createQueryBuilder()
      .delete()
      .from(PasskeyChallengeEntity)
      .where('"expiresAt" <= NOW()')
      .execute();
  }

  private async consumeChallenge(
    challenge: string,
    type: PasskeyChallengeType,
    userId: string | null,
  ): Promise<boolean> {
    const deleteQuery = this.challengeRepository
      .createQueryBuilder()
      .delete()
      .from(PasskeyChallengeEntity)
      .where('digest = :digest', {
        digest: digestPasskeyChallenge(challenge),
      })
      .andWhere('type = :type', { type })
      .andWhere('"expiresAt" > NOW()');

    if (userId === null) {
      deleteQuery.andWhere('"userId" IS NULL');
    } else {
      deleteQuery.andWhere('"userId" = :userId', { userId });
    }

    const result = await deleteQuery.returning('digest').execute();
    return result.affected === 1;
  }
}
