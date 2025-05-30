import { Injectable } from '@nestjs/common';
import { getSkillRoutePath } from '@packages/scenario-routing';
import { strEllipsis } from '@packages/shared-types';
import * as _ from 'lodash';
import { DiceTossService } from '../../../../dice-toss/dice-toss.service';
import type { SkillServiceProps } from '../../../../skill-group-lib/skill-service-lib';
import { UserActivityService } from '../../../../user-activity/user-activity.service';
import { UserService } from '../../../../user/user.service';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonMoneyCollectionService,
  MoneyCollectionIdEnum,
} from '../../common/money-collection/common-money-collection.service';
import type { MoneyCollectionOtherUserReceivedCashLandEventResult } from '../../land-event-groups/money-collection/money-collection.land-event';
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
    private userService: UserService,
    private userActivityService: UserActivityService,
    private diceTossService: DiceTossService,
  ) {}

  async index(props: SkillServiceProps) {
    await this.diceTossService.setUserCanTossDice(
      props.userId,
      getUserCanTossDice(SCENARIO_NAMES.D1),
    );

    const { username, cash } = await this.userService.findUserWithCache(
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
      await this.userService.changeUserCash(
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
      await this.userService.changeUserCash(props.userId, -1000);
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
