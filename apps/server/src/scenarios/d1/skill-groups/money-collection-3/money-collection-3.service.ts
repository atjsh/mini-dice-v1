import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { strEllipsis } from '@packages/shared-types';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserRepository } from 'apps/server/src/user/user.repository';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonMoneyCollectionService,
  MoneyCollectionIdEnum,
} from '../../common/money-collection/common-money-collection.service';

export enum MoneyCollection3ResultEnum {
  // 돈을 지불하지 않았음
  SKIPPED,

  // 돈을 지불했음
  PAYED,

  // 돈을 수령했음
  RECIEVED,
}

export const moneyCollection3Fee = 10000;
export const moneyCollection3MinimumCashOwningThreshold = 10000;
export const moneyCollection3ReceiveAtCount = 50;

@Injectable()
export class MoneyCollection3Service {
  constructor(
    private commonMoneyCollectionService: CommonMoneyCollectionService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async index(props: SkillServiceProps) {
    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    const { username, cash } = await this.userRepository.findUserWithCache(
      props.userId,
    );

    const usernameLength =
      await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
      );

    if (
      cash < moneyCollection3MinimumCashOwningThreshold &&
      usernameLength.length < moneyCollection3ReceiveAtCount
    ) {
      return {
        result: MoneyCollection3ResultEnum.SKIPPED,
        usernamesLength: usernameLength.length,
      };
    }

    const moneyCollectionUsernames =
      await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
      );
    if (moneyCollectionUsernames.length >= moneyCollection3ReceiveAtCount) {
      await this.userRepository.changeUserCash(
        props.userId,
        moneyCollection3Fee * moneyCollectionUsernames.length,
      );
      await this.commonMoneyCollectionService.resetUsernamesOnMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
      );

      return {
        result: MoneyCollection3ResultEnum.RECIEVED,
        earnedCash: moneyCollection3Fee * moneyCollectionUsernames.length,
        usernames: moneyCollectionUsernames.map((username) =>
          strEllipsis(username, 4),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    } else {
      await this.userRepository.changeUserCash(
        props.userId,
        -moneyCollection3Fee,
      );
      await this.commonMoneyCollectionService.addUsernameToMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
        props.userId,
      );

      return {
        result: MoneyCollection3ResultEnum.PAYED,
        payedCash: moneyCollection3Fee,
        usernames: moneyCollectionUsernames.map((username) =>
          strEllipsis(username, 4),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    }
  }
}
