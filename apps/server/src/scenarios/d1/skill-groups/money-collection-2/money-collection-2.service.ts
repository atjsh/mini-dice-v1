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

export enum MoneyCollection2ResultEnum {
  // 돈을 지불하지 않았음
  SKIPPED,

  // 돈을 지불했음
  PAYED,

  // 돈을 수령했음
  RECIEVED,

  // 조건에 총족되지만 돈을 수령하지 못했음
  NO_GIVER,
}

const fee = 2000;

@Injectable()
export class MoneyCollection2Service {
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

    if (3000 >= cash && cash >= 1000) {
      return {
        result: MoneyCollection2ResultEnum.SKIPPED,
      };
    } else if (1000 > cash) {
      const usernames =
        await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
        );

      if (usernames.length == 0) {
        return {
          result: MoneyCollection2ResultEnum.NO_GIVER,
        };
      } else {
        const earning = fee * usernames.length;
        const { cash: updatedCash } = await this.userRepository.changeUserCash(
          props.userId,
          earning,
        );

        await this.commonMoneyCollectionService.resetUsernamesOnMoneyCollection(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
        );

        return {
          result: MoneyCollection2ResultEnum.RECIEVED,
          collected: fee * usernames.length,
          usernames: usernames.map((username) => strEllipsis(username, 4)),
          updatedCash,
        };
      }
    } else {
      await this.userRepository.changeUserCash(props.userId, -fee);
      const usernames =
        await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
        );
      const { usernames: addedUsernames } =
        await this.commonMoneyCollectionService.addUsernameToMoneyCollection(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
          props.userId,
        );

      return {
        result: MoneyCollection2ResultEnum.PAYED,
        usernames: usernames.map((username) => strEllipsis(username, 4)),
        usernameLength: usernames.length,
        collected: fee * addedUsernames.length,
        payed: fee,
      };
    }
  }
}
