import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyCollectionEntity } from './entity/money-collection.entity';

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
    @InjectRepository(MoneyCollectionEntity)
    private moneyCollectionRepository: Repository<MoneyCollectionEntity>,
  ) {}

  async resetUsernamesOnMoneyCollection(
    moneyCollectionId: MoneyCollectionIdEnum,
  ): Promise<void> {
    await this.moneyCollectionRepository.update(moneyCollectionId, {
      usernames: null,
    });
  }

  async addUsernameToMoneyCollection(
    moneyCollectionId: MoneyCollectionIdEnum,
    username: string,
  ): Promise<MoneyCollectionStatus> {
    return await this.moneyCollectionRepository.manager.transaction(
      async (entityManager) => {
        const moneyCollectionRepository = entityManager.getRepository(
          MoneyCollectionEntity,
        );

        const moneyCollection = await moneyCollectionRepository.findOne(
          moneyCollectionId,
        );
        if (moneyCollection != undefined) {
          const updatedUsernames = [
            ...(moneyCollection.usernames
              ? moneyCollection.usernames.split(',')
              : []),
            username,
          ];
          await moneyCollectionRepository.update(moneyCollectionId, {
            usernames: updatedUsernames.join(','),
          });

          return {
            id: moneyCollectionId,
            usernames: updatedUsernames,
          };
        }

        const usernames = [username];
        await moneyCollectionRepository.insert(
          moneyCollectionRepository.create({
            id: moneyCollectionId,
            usernames: usernames.join(','),
          }),
        );

        return {
          id: moneyCollectionId,
          usernames,
        };
      },
    );
  }

  async getMoneyCollectionUsernamesLength(
    moneyCollectionId: MoneyCollectionIdEnum,
  ): Promise<string[]> {
    return await this.moneyCollectionRepository.manager.transaction(
      async (entityManager) => {
        const moneyCollectionRepository = entityManager.getRepository(
          MoneyCollectionEntity,
        );

        const moneyCollection = await moneyCollectionRepository.findOne(
          moneyCollectionId,
        );
        if (moneyCollection && moneyCollection.usernames) {
          return moneyCollection.usernames.split(',');
        }

        return [];
      },
    );
  }
}
