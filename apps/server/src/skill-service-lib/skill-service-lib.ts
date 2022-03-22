import { applyDecorators, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  getSkillMethodUrl,
  Skill,
  SkillRouteType,
} from '@packages/scenario-routing';
import { UserIdType } from '@packages/shared-types';
import { IndexSkill } from '../skill-group-lib/constants';

export type BaseSkillServiceProps = {
  userId: UserIdType;
  // userActivity: UserActivityType;
};

export type SkillServiceProps<
  T extends Record<string, any> = Record<string, unknown>,
> = Readonly<BaseSkillServiceProps & T>;

export function getBaseSkillServiceProps(
  props: SkillServiceProps,
): BaseSkillServiceProps {
  return {
    userId: props.userId,
    // userActivity: props.userActivity,
  };
}

export const SkillGroupAlias = () => applyDecorators(Get('skill-group-alias'));

export const SkillDraw = (skillRoute: SkillRouteType) =>
  applyDecorators(
    ApiBody({
      type: Object,
      required: false,
    }),
    Post(`${getSkillMethodUrl(skillRoute.name)}/draw`),
  );
export const WebSkill = (skillRoute: SkillRouteType) =>
  applyDecorators(Skill(skillRoute));

export const WebSkillDraw = (skillRoute: SkillRouteType) =>
  applyDecorators(SkillDraw(skillRoute));

export const WebIndexSkillDraw = () =>
  applyDecorators(
    ApiBody({
      type: Object,
      required: false,
    }),
    Post(`${getSkillMethodUrl(IndexSkill)}/draw`),
    // UseInterceptors(HttpCacheInterceptor),
  );

export type MethodReturnType<T, M extends keyof T> = T[M] extends (
  ...arg: any[]
) => any
  ? Awaited<ReturnType<T[M]>>
  : never;
