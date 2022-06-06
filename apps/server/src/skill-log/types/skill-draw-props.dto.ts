import { PlainMessageType } from '@packages/shared-types';
import {
  UserActivityType,
  DiceUserActivity,
  GameStartUserAcitvity,
  InteractionUserActivity,
} from './user-activity.dto';

export type SkillDrawPropsType<
  UserActivity extends UserActivityType,
  SkillServiceResult,
> = {
  date: Date;
  timezone: string;
  userActivity: UserActivity;
  skillServiceResult: SkillServiceResult;
};

export type GameStartUserAcitvitySkillDrawPropsType = SkillDrawPropsType<
  GameStartUserAcitvity,
  null
>;

export type DiceUserActivitySkillDrawPropsType<SkillServiceResult> =
  SkillDrawPropsType<DiceUserActivity, SkillServiceResult>;

export type InteractionUserActivitySkillDrawPropsType<SkillServiceResult> =
  SkillDrawPropsType<InteractionUserActivity, SkillServiceResult>;

export interface LandEventDrawPropsType<LandEventResult> {
  landEventResult: LandEventResult;
  date: Date;
  timezone: string;
}

export type LandEventDrawResultType = PlainMessageType;

export type LandEventsSummarizePropsType<LandEventResult> =
  LandEventDrawPropsType<LandEventResult>[];

export interface LandEventsSummarizeResultType {
  summaryText: string;
  cashChangeAmount: bigint;
}
