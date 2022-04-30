import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { strEllipsis } from '@packages/shared-types';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import {
  CommonMoneyCollectionService,
  MoneyCollectionIdEnum,
} from '../../common/money-collection/common-money-collection.service';

export enum MoneyCollection1ResultEnum {
  // 돈을 지불하지 않았음
  SKIPPED,

  // 돈을 지불했음
  PAYED,

  // 돈을 수령했음
  RECIEVED,
}

@Injectable()
export class MoneyCollection1Service {
  constructor(
    private commonMoneyCollectionService: CommonMoneyCollectionService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async index(props: SkillServiceProps) {
    const { username, cash } = await this.userRepository.findUserWithCache(
      props.userId,
    );

    if (cash < 1000) {
      return {
        result: MoneyCollection1ResultEnum.SKIPPED,
      };
    }

    const moneyCollectionUsernames =
      await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
        MoneyCollectionIdEnum.MONEY_COLLECTION_1,
      );
    if (moneyCollectionUsernames.length >= 10) {
      await this.userRepository.changeUserCash(
        props.userId,
        1000 * moneyCollectionUsernames.length,
      );
      await this.commonMoneyCollectionService.resetUsernamesOnMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_1,
      );

      return {
        result: MoneyCollection1ResultEnum.RECIEVED,
        earnedCash: 1000 * moneyCollectionUsernames.length,
        usernames: moneyCollectionUsernames.map((username) =>
          strEllipsis(username, 6),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    } else {
      await this.userRepository.changeUserCash(props.userId, -1000);
      await this.commonMoneyCollectionService.addUsernameToMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_1,
        username,
      );

      return {
        result: MoneyCollection1ResultEnum.PAYED,
        payedCash: 1000,
        usernames: moneyCollectionUsernames.map((username) =>
          strEllipsis(username, 6),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    }
  }
}
