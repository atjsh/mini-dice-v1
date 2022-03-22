import { Post } from '@nestjs/common';
import { getSkillMethodUrl } from '@packages/scenario-routing';
import {
  UserActivityMessage,
  UserActivityMessageType,
} from '@packages/shared-types';
import * as _ from 'lodash';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { DiceUserActivity } from '../skill-log/types/user-activity.dto';
import { SkillServiceProps } from '../skill-service-lib/skill-service-lib';
import { SkillService } from '../skill-service-lib/skill-service.interface';
import { IndexSkill } from './constants';

export abstract class SkillGroupController<T extends SkillService> {
  constructor(protected skillService: T) {}

  @JwtAuth()
  @Post(getSkillMethodUrl(IndexSkill))
  async webIndex(@UserJwt() { userId }: UserJwtDto) {
    const skillServiceProps: SkillServiceProps = {
      userId,
    };
    return await this.skillService.index(skillServiceProps);
  }

  drawDiceUserActivityMessage(
    diceUserActivity: DiceUserActivity,
  ): UserActivityMessageType {
    return UserActivityMessage({
      type: 'diceTossUserActivityMessage',
      title: `🎲 ${diceUserActivity.diceResult.join(', ')} 나옴${
        diceUserActivity.stockChangeAmount != undefined
          ? `\n 더블 발생으로 주가가 ${
              diceUserActivity.stockChangeAmount > 0
                ? `+${diceUserActivity.stockChangeAmount}`
                : `${diceUserActivity.stockChangeAmount}`
            }원 ${diceUserActivity.stockChangeAmount > 0 ? `상승` : `하락`}했음`
          : ''
      }`,
      description: `${_.sum(diceUserActivity.diceResult)}칸을 이동했다`,
    });
  }

  abstract getSkillGroupAlias(): Promise<string> | string;
}
