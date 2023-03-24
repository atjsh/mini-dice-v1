import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserIdType } from '@packages/shared-types';
import type { Repository } from 'typeorm';
import { MoneyCollectionParticipantsEntity } from './entity/money-collection-participants.entity';

export enum MoneyCollectionIdEnum {
  MONEY_COLLECTION_1 = 1,
  MONEY_COLLECTION_2 = 2,
  MONEY_COLLECTION_3 = 3,
  MONEY_COLLECTION_4 = 4,
}

export class MoneyCollectionStatus {
  id: MoneyCollectionIdEnum;
  usernames: string[];
}

@Injectable()
export class CommonMoneyCollectionService {
  constructor(
    @InjectRepository(MoneyCollectionParticipantsEntity)
    private moneyCollectionParticipantsRepository: Repository<MoneyCollectionParticipantsEntity>,
  ) {}

  async resetUsernamesOnMoneyCollection(
    moneyCollectionId: MoneyCollectionIdEnum,
  ): Promise<void> {
    await this.moneyCollectionParticipantsRepository.delete({
      moneyCollectionId: moneyCollectionId,
    });
  }

  async addUsernameToMoneyCollection(
    moneyCollectionId: MoneyCollectionIdEnum,
    userId: UserIdType,
  ): Promise<MoneyCollectionStatus> {
    await this.moneyCollectionParticipantsRepository.insert({
      moneyCollectionId: moneyCollectionId,
      userId: userId,
    });

    return (
      await this.moneyCollectionParticipantsRepository.find({
        relations: ['user'],
        where: {
          moneyCollectionId: moneyCollectionId,
        },
      })
    ).reduce(
      (acc, cur) => {
        cur.user ? acc.usernames.push(cur.user.username) : null;
        return acc;
      },
      {
        id: moneyCollectionId,
        usernames: [] as string[],
      },
    );
  }

  async getMoneyCollectionUsernamesLength(
    moneyCollectionId: MoneyCollectionIdEnum,
  ): Promise<{ username: string; userId: UserIdType }[]> {
    return (
      await this.moneyCollectionParticipantsRepository.find({
        relations: ['user'],
        where: {
          moneyCollectionId: moneyCollectionId,
        },
      })
    )
      .map((moneyCollectionParticipants) => ({
        username: moneyCollectionParticipants.user?.username,
        userId: moneyCollectionParticipants.user?.id,
      }))
      .filter((username) => typeof username != 'undefined') as {
      username: string;
      userId: UserIdType;
    }[];
  }
}
