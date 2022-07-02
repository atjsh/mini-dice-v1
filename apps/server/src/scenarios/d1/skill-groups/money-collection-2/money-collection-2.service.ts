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

    if (3000 >= cash && cash >= 1000) {
      return {
        result: MoneyCollection2ResultEnum.SKIPPED,
      };
    } else if (1000 > cash) {
      const participants =
        await this.commonMoneyCollectionService.getMoneyCollectionUsernamesLength(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
        );

      if (participants.length == 0) {
        return {
          result: MoneyCollection2ResultEnum.NO_GIVER,
        };
      } else {
        const earning = fee * participants.length;
        const { cash: updatedCash } = await this.userService.changeUserCash(
          props.userId,
          earning,
        );

        await this.commonMoneyCollectionService.resetUsernamesOnMoneyCollection(
          MoneyCollectionIdEnum.MONEY_COLLECTION_2,
        );

        await Promise.all(
          _.uniqBy(participants, (e) => e.userId)
            .filter((e) => e.userId != props.userId)
            .map(
              async (participant) =>
                await this.userActivityService.create<MoneyCollectionOtherUserReceivedCashLandEventResult>(
                  {
                    userId: participant.userId,
                    skillRoute: getSkillRoutePath(
                      D1ScenarioRoutes.skillGroups.landEventMoneyCollection
                        .skills.otherUserReceivedCash,
                    ),
                    skillDrawProps: {
                      earnedCash: earning,
                      moneyCollectionName: '기부',
                      otherUserUsername: username,
                      participantHeadcount: participants.length,
                    },
                  },
                ),
            ),
        );

        return {
          result: MoneyCollection2ResultEnum.RECIEVED,
          collected: fee * participants.length,
          usernames: participants.map(({ username }) =>
            strEllipsis(username, 4),
          ),
          updatedCash,
        };
      }
    } else {
      await this.userService.changeUserCash(props.userId, -fee);
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
        usernames: usernames.map(({ username }) => strEllipsis(username, 4)),
        usernameLength: usernames.length,
        collected: fee * addedUsernames.length,
        payed: fee,
      };
    }
  }
}
