import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSkillRoutePath } from '@packages/scenario-routing';
import { strEllipsis } from '@packages/shared-types';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserActivityService } from 'apps/server/src/user-activity/user-activity.service';
import { UserRepository } from 'apps/server/src/user/user.repository';
import * as _ from 'lodash';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonMoneyCollectionService,
  MoneyCollectionIdEnum,
} from '../../common/money-collection/common-money-collection.service';
import { MoneyCollectionOtherUserReceivedCashLandEventResult } from '../../land-event-groups/money-collection/money-collection.land-event';
import { D1ScenarioRoutes } from '../../routes';

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
    private userActivityService: UserActivityService,
  ) {}

  async index(props: SkillServiceProps) {
    await this.userRepository.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    const { username, cash } = await this.userRepository.findUserWithCache(
      props.userId,
    );

    if (cash < 1000) {
      const usernameLength =
        await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
          MoneyCollectionIdEnum.MONEY_COLLECTION_1,
        );

      return {
        result: MoneyCollection1ResultEnum.SKIPPED,
        usernamesLength: usernameLength.length,
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

      await Promise.all(
        _.uniqBy(moneyCollectionUsernames, (e) => e.userId)
          .filter((e) => e.userId != props.userId)
          .map(
            async (participants) =>
              await this.userActivityService.create<MoneyCollectionOtherUserReceivedCashLandEventResult>(
                {
                  userId: participants.userId,
                  skillRoute: getSkillRoutePath(
                    D1ScenarioRoutes.skillGroups.landEventMoneyCollection.skills
                      .otherUserReceivedCash,
                  ),
                  skillDrawProps: {
                    earnedCash: 1000 * moneyCollectionUsernames.length,
                    moneyCollectionName: '모임통장',
                    otherUserUsername: username,
                    participantHeadcount: moneyCollectionUsernames.length,
                  },
                },
              ),
          ),
      );

      return {
        result: MoneyCollection1ResultEnum.RECIEVED,
        earnedCash: 1000 * moneyCollectionUsernames.length,
        usernames: moneyCollectionUsernames.map(({ username }) =>
          strEllipsis(username, 6),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    } else {
      await this.userRepository.changeUserCash(props.userId, -1000);
      await this.commonMoneyCollectionService.addUsernameToMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_1,
        props.userId,
      );

      return {
        result: MoneyCollection1ResultEnum.PAYED,
        payedCash: 1000,
        usernames: moneyCollectionUsernames.map(({ username }) =>
          strEllipsis(username, 6),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    }
  }
}
