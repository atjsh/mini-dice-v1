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
