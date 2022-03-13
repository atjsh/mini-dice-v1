import { applyDecorators, Post, SetMetadata } from '@nestjs/common';
import { SkillMetadataKey } from '../constants';
import { SkillRouteType } from '../scenario-route.interface';
import { getSkillMethodUrl } from './url';

const SetAsSkillMethod = (skillRoute: SkillRouteType) =>
  SetMetadata(SkillMetadataKey, skillRoute);

/**
 * 데코레이터가 달릴 컨트롤러 메소드를
 * 스킬 메소드로 등록함.
 * @param skillName
 * @returns
 */
export const Skill = (skillRoute: SkillRouteType) => {
  return applyDecorators(
    /**
     * 스킬 전용 HTTP 엔드포인트로 POST 요청을 통해
     * 스킬 요청을 받을 수 있도록 설정함
     */
    Post(getSkillMethodUrl(skillRoute.name)),

    /**
     * 데코레이터가 달릴 컨트롤러 메소드를
     * 스킬 메소드로 등록함.
     */
    SetAsSkillMethod(skillRoute),
  );
};
