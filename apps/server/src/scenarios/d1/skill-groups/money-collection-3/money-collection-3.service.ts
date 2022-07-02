import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSkillRoutePath } from '@packages/scenario-routing';
import { strEllipsis } from '@packages/shared-types';
import { DiceTossService } from 'apps/server/src/dice-toss/dice-toss.service';
import { SkillServiceProps } from 'apps/server/src/skill-group-lib/skill-service-lib';
import { UserActivityService } from 'apps/server/src/user-activity/user-activity.service';
import { UserService } from 'apps/server/src/user/user.service';
import * as _ from 'lodash';
import { getUserCanTossDice } from '../../../scenarios.commons';
import { SCENARIO_NAMES } from '../../../scenarios.constants';
import {
  CommonMoneyCollectionService,
  MoneyCollectionIdEnum,
} from '../../common/money-collection/common-money-collection.service';
import { MoneyCollectionOtherUserReceivedCashLandEventResult } from '../../land-event-groups/money-collection/money-collection.land-event';
import { D1ScenarioRoutes } from '../../routes';

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
      await this.userService.changeUserCash(
        props.userId,
        moneyCollection3Fee * moneyCollectionUsernames.length,
      );
      await this.commonMoneyCollectionService.resetUsernamesOnMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
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
                    earnedCash:
                      moneyCollection3Fee * moneyCollectionUsernames.length,
                    moneyCollectionName: '일확천금 노리기',
                    otherUserUsername: username,
                    participantHeadcount: moneyCollectionUsernames.length,
                  },
                },
              ),
          ),
      );

      return {
        result: MoneyCollection3ResultEnum.RECIEVED,
        earnedCash: moneyCollection3Fee * moneyCollectionUsernames.length,
        usernames: moneyCollectionUsernames.map(({ username }) =>
          strEllipsis(username, 4),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    } else {
      await this.userService.changeUserCash(props.userId, -moneyCollection3Fee);
      await this.commonMoneyCollectionService.addUsernameToMoneyCollection(
        MoneyCollectionIdEnum.MONEY_COLLECTION_3,
        props.userId,
      );

      return {
        result: MoneyCollection3ResultEnum.PAYED,
        payedCash: moneyCollection3Fee,
        usernames: moneyCollectionUsernames.map(({ username }) =>
          strEllipsis(username, 4),
        ),
        usernamesLength: moneyCollectionUsernames.length,
      };
    }
  }
}
