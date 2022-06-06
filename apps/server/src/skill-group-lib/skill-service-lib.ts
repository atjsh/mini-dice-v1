import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import {
  getSkillGroupPath,
  getSkillRoutePath,
  SkillGroupRouteType,
  SkillRouteType,
} from '@packages/scenario-routing';
import {
  LandEventDrawMetadataKey,
  LandEventsSummarizeMetadataKey,
  SkillDrawMetadataKey,
  SkillGroupMetadataKey,
  SkillMetadataKey,
} from '@packages/scenario-routing/constants';
import {
  cashLocale,
  UserActivityMessage,
  UserActivityMessageType,
  UserIdType,
} from '@packages/shared-types';
import * as _ from 'lodash';
import {
  DiceUserActivity,
  UserActivityType,
} from '../skill-log/types/user-activity.dto';

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

export type SkillPropsType<UserActivity extends UserActivityType> = {
  userId: UserIdType;
  userActivity: UserActivity;
};

export const SkillDraw = (skill: SkillRouteType) =>
  SetMetadata(SkillDrawMetadataKey, getSkillRoutePath(skill));

export const Skill = (skill: SkillRouteType) =>
  SetMetadata(SkillMetadataKey, getSkillRoutePath(skill));

export const SkillGroup = (skillGroup: SkillGroupRouteType) =>
  applyDecorators(
    SetMetadata(SkillGroupMetadataKey, getSkillGroupPath(skillGroup)),
    Injectable(),
  );

export const LandEventDraw = (land: SkillRouteType) =>
  SetMetadata(LandEventDrawMetadataKey, getSkillRoutePath(land));

export const LandEventsSummarize = (land: SkillRouteType) =>
  SetMetadata(LandEventsSummarizeMetadataKey, getSkillRoutePath(land));

export function drawDiceUserActivityMessage(
  diceUserActivity: DiceUserActivity,
): UserActivityMessageType[] {
  return [
    UserActivityMessage({
      type: 'diceTossUserActivityMessage',
      title: `오른쪽으로 ${_.sum(diceUserActivity.diceResult)}칸 이동`,
      description: `${diceUserActivity.diceResult
        .map((dice) => `🎲 ${dice}`)
        .join(' + ')}`,
    }),
    ...(diceUserActivity.stockPriceChange != undefined
      ? [
          UserActivityMessage({
            type: 'interactionUserActivityMessage',
            title: '주가 변동',
            description: `${
              BigInt(diceUserActivity.stockPriceChange.stockPriceDifference) > 0
                ? `짝수 더블 발생, 주가 ${cashLocale(
                    diceUserActivity.stockPriceChange.stockPriceDifference,
                  )} 상승`
                : `홀수 더블 발생, 주가 ${cashLocale(
                    diceUserActivity.stockPriceChange.stockPriceDifference,
                  )} 하락`
            }${
              diceUserActivity.stockPriceChange.forcedSoldCash != false
                ? `\n\n주가가 ${cashLocale(
                    1000,
                  )} 이하로 하락(현 가치 ${cashLocale(
                    diceUserActivity.stockPriceChange.changedStockPrice,
                  )})했기 때문에 주식이 강제로 판매되었음, 현금 ${cashLocale(
                    diceUserActivity.stockPriceChange.forcedSoldCash,
                  )} 받았다`
                : ''
            }`,
          }),
        ]
      : []),
  ];
}
