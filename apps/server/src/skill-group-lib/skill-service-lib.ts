import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import {
  SkillGroupRouteType,
  SkillRouteType,
} from '@packages/scenario-routing';
import {
  SkillDrawMetadataKey,
  SkillGroupMetadataKey,
  SkillMetadataKey,
} from '@packages/scenario-routing/constants';
import {
  UserActivityMessage,
  UserActivityMessageType,
  UserIdType,
} from '@packages/shared-types';
import _ from 'lodash';
import { DiceUserActivity } from '../skill-log/types/user-activity.dto';

export type BaseSkillServiceProps = {
  userId: UserIdType;
  // userActivity: UserActivityType;
};

export type SkillServiceProps<
  T extends Record<string, any> = Record<string, unknown>,
> = Readonly<BaseSkillServiceProps & T>;

export interface SkillService {
  index: (props: SkillServiceProps) => any | Promise<any>;
}

export function getBaseSkillServiceProps(
  props: SkillServiceProps,
): BaseSkillServiceProps {
  return {
    userId: props.userId,
    // userActivity: props.userActivity,
  };
}

export type MethodReturnType<T, M extends keyof T> = T[M] extends (
  ...arg: any[]
) => any
  ? Awaited<ReturnType<T[M]>>
  : never;

export type IndexSkillPropsType = {
  userId: UserIdType;
};

export const SkillDraw = (skill: SkillRouteType) =>
  SetMetadata(SkillDrawMetadataKey, skill);

export const Skill = (skill: SkillRouteType) =>
  SetMetadata(SkillMetadataKey, skill);

export const SkillGroup = (skillGroup: SkillGroupRouteType) =>
  applyDecorators(SetMetadata(SkillGroupMetadataKey, skillGroup), Injectable());

export function drawDiceUserActivityMessage(
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
